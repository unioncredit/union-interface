import { useCallback, useMemo, useState } from "react";
import { useContractWrite, usePrepareContractWrite, useNetwork } from "wagmi";

import { Status } from "constants";
import praseAppLog from "utils/praseAppLog";
import createParseToast from "utils/parseToast";
import useContract from "hooks/useContract";
import { useToasts } from "providers/Toasts";
import { useAppLogs } from "providers/AppLogs";
import { useVersion } from "providers/Version";

export default function useWrite({
  disabled: isDisabled,
  method,
  args,
  enabled,
  contract,
  onComplete,
}) {
  const { version } = useVersion();
  const { chain } = useNetwork();
  const { addLog } = useAppLogs();
  const { addToast, closeToast } = useToasts();
  const contractConfig = useContract(contract);
  const [loading, setLoading] = useState(false);

  const memoisedArgs = useMemo(() => args, [JSON.stringify(args)]);

  const { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: method,
    args: memoisedArgs,
    enabled,
  });

  const { writeAsync } = useContractWrite(config);

  /**
   * onClick is just the name of the action function for this
   * write. When fired the action defined by the hook inputs
   * will be executed.
   */
  const onClick = useCallback(async () => {
    setLoading(true);

    const parseToast = createParseToast(method, args, chain.id, version);

    let toastId = addToast(parseToast(Status.PENDING, null), false);

    try {
      const tx = await writeAsync();

      // Replace current pending toast with a new pending toast
      // that links out to etherscan
      closeToast(toastId);
      toastId = addToast(parseToast(Status.PENDING, tx), false);

      const response = await tx.wait();

      onComplete && (await onComplete());

      addLog(praseAppLog(Status.SUCCESS, method, args, tx));
      addToast(
        parseToast(response.status ? Status.SUCCESS : Status.FAILED, tx)
      );

      return true;
    } catch (error) {
      console.log("TxButton error:", error);
      console.log("TxButton error message:", error.message);
      console.log("TxButton error code:", error.code);

      if (error.code == 4001) {
        // User rejected the request
        addToast({
          link: null,
          variant: Status.FAILED,
          title: "User rejected",
          content: "User rejected the request",
          id: `${Status.FAILED}__${method}__${Date.now()}`,
        });
      } else {
        addToast(parseToast(Status.FAILED, null));
      }

      return false;
    } finally {
      setLoading(false);
      closeToast(toastId);
    }
  }, [writeAsync, method, JSON.stringify(args), chain.id]);

  /*--------------------------------------------------------------
    Return  
   --------------------------------------------------------------*/

  return useMemo(
    () => ({
      disabled: isDisabled || !writeAsync,
      loading,
      onClick,
    }),
    [writeAsync, onClick, loading, isDisabled]
  );
}
