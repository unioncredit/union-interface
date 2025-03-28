import { useCallback, useMemo, useState } from "react";
import { useContractWrite, useNetwork, usePrepareContractWrite, useSigner } from "wagmi";

import createParseToast from "utils/parseToast";
import useContract from "hooks/useContract";
import parseAppLog from "utils/parseAppLog";
import { Status } from "constants";
import { useToasts } from "providers/Toasts";
import { useAppLogs } from "providers/AppLogs";
import { useVersion } from "providers/Version";
import { useToken } from "hooks/useToken";

export default function useWrite({
  disabled: isDisabled,
  method,
  args,
  enabled,
  contract,
  onComplete,
  overrides = undefined,
}) {
  const [loading, setLoading] = useState(false);

  const { data: signer } = useSigner();
  const { version } = useVersion();
  const { chain } = useNetwork();
  const { addLog } = useAppLogs();
  const { addToast, closeToast } = useToasts();
  const { token } = useToken();
  const contractConfig = useContract(contract);

  const memoisedArgs = useMemo(() => args, [JSON.stringify(args)]);

  let { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: method,
    args: memoisedArgs,
    enabled,
    overrides,
  });

  const { writeAsync } = useContractWrite({
    ...config,
    mode: "recklesslyUnprepared",
  });

  /**
   * onClick is just the name of the action function for this
   * write. When fired the action defined by the hook inputs
   * will be executed.
   */
  const onClick = useCallback(async () => {
    setLoading(true);

    const parseToast = createParseToast(method, memoisedArgs, token, chain.id, version, contract);

    let toastId = addToast(parseToast(Status.PENDING, null), false);

    try {
      const tx = await writeAsync({
        recklesslySetUnpreparedOverrides: overrides,
      });

      // Replace current pending toast with a new pending toast
      // that links out to etherscan
      closeToast(toastId);
      toastId = addToast(parseToast(Status.PENDING, tx), false);

      const response = await tx.wait();

      onComplete && onComplete();

      addLog(parseAppLog(Status.SUCCESS, method, memoisedArgs, tx));
      addToast(parseToast(response.status ? Status.SUCCESS : Status.FAILED, tx));

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
  }, [writeAsync, method, memoisedArgs, chain?.id, signer, JSON.stringify(contractConfig)]);

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
