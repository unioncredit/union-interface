import { useReadContracts } from "wagmi";

import useContract from "hooks/useContract";
import { getVersion } from "providers/Version";
import { CACHE_TIME, STALE_TIME, ZERO } from "constants";

export default function useMemberSummary(address, chainId) {
  const userManagerContract = useContract("userManager", chainId, getVersion(chainId));

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

  const { data, ...resp } = useReadContracts({
    contracts: contracts.map((contract) => ({
      ...contract,
      chainId,
    })),
    query: {
      enabled: !!address,
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      select: (data) => ({
        isMember: data[0].result || false,
        creditLimit: data[1].result || ZERO,
      }),
    },
  });

  return {
    data: { ...data, address },
    ...resp,
  };
}
