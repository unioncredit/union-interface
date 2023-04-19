import { useContractRead } from "wagmi";
import useContract from "hooks/useContract";

export function useBalance(address, contractName, chainId) {
  return useContractRead({
    ...useContract(contractName, chainId),
    functionName: "balanceOf",
    args: [address],
    chainId: chainId,
  });
}
