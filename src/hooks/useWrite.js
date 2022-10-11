import { useContractWrite, usePrepareContractWrite } from "wagmi";

import useContract from "hooks/useContract";
import { useCallback, useMemo } from "react";

export default function useWrite({
  disabled,
  method,
  args,
  enabled,
  contract,
}) {
  const contractConfig = useContract(contract);

  const { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: method,
    args,
    enabled,
  });

  const { isLoading, writeAsync } = useContractWrite(config);

  const handleTx = useCallback(async () => {
    try {
      const resp = await writeAsync();
      console.log(resp);
      debugger;
    } catch (error) {
      console.log("TxButton error:", error);
      console.log("TxButton error message:", error.message);
      console.log("TxButton error code:", error.code);

      if (error.code == "ACTION_REJECTED") {
        // User rejected the request
        // TODO:
      }
    }
  }, [writeAsync]);

  return useMemo(
    () => ({
      disabled: disabled || !writeAsync,
      loading: isLoading,
      onClick: handleTx,
    }),
    [handleTx, isLoading, disabled, writeAsync]
  );
}
