import { useCallback, useMemo, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { Status } from "constants";
import praseAppLog from "utils/praseAppLog";
import useContract from "hooks/useContract";
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

    try {
      const tx = await writeAsync();
      await tx.wait();

      onComplete && onComplete();

      addLog(praseAppLog(Status.SUCCESS, method, args, tx));
    } catch (error) {
      console.log("TxButton error:", error);
      console.log("TxButton error message:", error.message);
      console.log("TxButton error code:", error.code);

      if (error.code == "ACTION_REJECTED") {
        // User rejected the request
        addLog(praseAppLog(Status.FAILED, method, args, null));
      }
    } finally {
      setLoading(false);
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
