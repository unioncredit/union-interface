import { useCallback, useMemo, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { Status } from "constants";
import praseAppLog from "utils/praseAppLog";
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

  const onClick = useCallback(async () => {
    setLoading(true);
    const toastId = addToast(
      {
        title: "Transaction pending",
        variant: Status.PENDING,
        content: "Transaction pending",
      },
      false
    );

    try {
      const tx = await writeAsync();
      await tx.wait();

      onComplete && onComplete();

      addLog(praseAppLog(Status.SUCCESS, method, args, tx));
      addToast({
        content: "Transaction success",
        variant: Status.SUCCESS,
        title: "Transaction success",
      });
    } catch (error) {
      console.log("TxButton error:", error);
      console.log("TxButton error message:", error.message);
      console.log("TxButton error code:", error.code);

      if (error.code == "ACTION_REJECTED") {
        // User rejected the request
        addLog(praseAppLog(Status.FAILED, method, args, null));
        addToast({
          content: "Transaction rejected by user",
          variant: Status.FAILED,
          title: "Transaction failed",
        });
      }
    } finally {
      setLoading(false);
      closeToast(toastId);
    }
  }, [writeAsync, method, JSON.stringify(args)]);

  return useMemo(
    () => ({
      disabled: isDisabled || !writeAsync,
      loading,
      onClick,
    }),
    [onClick, loading, isDisabled]
  );
}
