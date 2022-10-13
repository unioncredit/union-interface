import { useCallback, useMemo, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

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
      parseToast(Status.PENDING, method, args, null),
      false
    );

    try {
      const tx = await writeAsync();
      await tx.wait();

      onComplete && onComplete();

      addLog(praseAppLog(Status.SUCCESS, method, args, tx));
      addToast(parseToast(Status.SUCCESS, method, args, tx));
    } catch (error) {
      console.log("TxButton error:", error);
      console.log("TxButton error message:", error.message);
      console.log("TxButton error code:", error.code);

      if (error.code == "ACTION_REJECTED") {
        // User rejected the request
        addToast(parseToast(Status.FAILED, method, args, null));
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
