import { useCallback, useMemo, useState } from "react";
import { useContractWrite, usePrepareContractWrite, useNetwork } from "wagmi";

import { Status } from "constants";
import praseAppLog from "utils/praseAppLog";
import parseToast from "utils/parseToast";
import useContract from "hooks/useContract";
import { useToasts } from "providers/Toasts";
import { useAppLogs } from "providers/AppLogs";

export default function useWrite({
  disabled: isDisabled,
  method,
  args,
  enabled,
  contract,
  onComplete,
}) {
  const { chain } = useNetwork();
  const { addLog } = useAppLogs();
  const { addToast, closeToast } = useToasts();
  const contractConfig = useContract(contract);
  const [loading, setLoading] = useState(false);

  const { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: method,
    args,
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
    let toastId = addToast(
      parseToast(Status.PENDING, method, args, null, chain.id),
      false
    );

    try {
      const tx = await writeAsync();

      // Replace current pending toast with a new pending toast
      // that links out to etherscan
      closeToast(toastId);
      toastId = addToast(
        parseToast(Status.PENDING, method, args, tx, chain.id),
        false
      );

      await tx.wait();

      onComplete && (await onComplete());

      addLog(praseAppLog(Status.SUCCESS, method, args, tx));
      addToast(parseToast(Status.SUCCESS, method, args, tx, chain.id));

      return true;
    } catch (error) {
      console.log("TxButton error:", error);
      console.log("TxButton error message:", error.message);
      console.log("TxButton error code:", error.code);

      if (error.code == "ACTION_REJECTED") {
        // User rejected the request
        addToast(parseToast(Status.FAILED, method, args, null, chain.id));
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
    [onClick, loading, isDisabled]
  );
}
