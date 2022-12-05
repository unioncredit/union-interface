import useContract from "./useContract";
import { useContractReads } from "wagmi";
import { CACHE_TIME, ZERO } from "constants";

export default function useMemberSummary(address, chainId) {
  const userManagerContract = useContract("userManager", chainId);

  const contracts = address
    ? [
      {
        ...userManagerContract,
        functionName: "checkIsMember",
        args: [address],
      },
      {
        ...userManagerContract,
        functionName: "getCreditLimit",
        args: [address],
      },
    ]
    : [];

  const { data, ...resp } = useContractReads({
    enabled: !!address,
    select: (data) => ({
      isMember: data[0] || false,
      creditLimit: data[1] || ZERO,
    }),
    contracts: contracts.map((contract) => ({
      ...contract,
      chainId,
    })),
    cacheTime: CACHE_TIME,
    staleTime: Infinity,
  });

  return {
    data: { ...data, address },
    ...resp,
  };
}