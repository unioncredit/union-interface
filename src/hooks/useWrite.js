import { useCallback, useMemo, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { Status } from "constants";
import useContract from "hooks/useContract";
import { useAppLogs } from "providers/AppLogs";

export default function useWrite({
  disabled,
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

  const handleTx = useCallback(async () => {
    setLoading(true);

    try {
      const tx = await writeAsync();
      const resp = await tx.wait();
      console.log(tx, resp);

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
  }, [writeAsync]);

  return useMemo(
    () => ({
      disabled: disabled || !writeAsync,
      loading,
      onClick: handleTx,
    }),
    [handleTx, loading, disabled, writeAsync]
  );
}
