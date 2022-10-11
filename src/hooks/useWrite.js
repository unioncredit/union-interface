import { useContractWrite, usePrepareContractWrite } from "wagmi";

import useContract from "hooks/useContract";

export default function useWrite({
  disabled,
  method,
  args,
  enabled,
  contract,
  ...props
}) {
  const contractConfig = useContract(contract);

  const { config } = usePrepareContractWrite({
    ...contractConfig,
    functionName: method,
    args,
    enabled,
  });

  const { isLoading, writeAsync } = useContractWrite(config);

  const handleTx = async () => {
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
      }
    }
  };

  return {
    ...props,
    disabled: disabled || !writeAsync,
    loading: isLoading,
    onClick: handleTx,
  };
}
