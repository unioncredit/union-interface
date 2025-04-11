import { useReadContracts } from "wagmi";

import useContract from "./useContract";
import { CACHE_TIME, STALE_TIME } from "constants";

export default function useRelatedAddresses(address, chainId, forceVersion) {
  const userManagerContract = useContract("userManager", chainId, forceVersion);

  const { data: { voucherCount = 0, voucheeCount = 0 } = {}, refetch: refetchCounts } =
    useReadContracts({
      contracts: [
        {
          ...userManagerContract,
          functionName: "getVoucherCount",
          args: [address],
          chainId,
        },
        {
          ...userManagerContract,
          functionName: "getVoucheeCount",
          args: [address],
          chainId,
        },
      ],
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      query: {
        enabled: !!address && !!userManagerContract,
        select: (data) => ({
          voucherCount: Number(data[0]?.result.toString() || "0"),
          voucheeCount: Number(data[1]?.result.toString() || "0"),
        }),
      },
    });

  const { data: stakerAddresses, refetch: refetchVouchers } = useReadContracts({
    contracts: Array(voucherCount)
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchers",
        args: [address, i],
        chainId,
      })),
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
    query: {
      enabled: voucherCount > 0,
      select: (data) => data.map((row) => row.result[0]),
    },
  });

  const { data: borrowerAddresses, refetch: refetchVouchees } = useReadContracts({
    contracts: Array(voucheeCount)
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchees",
        args: [address, i],
        chainId,
      })),
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
    query: {
      enabled: voucheeCount > 0,
      select: (data) => data.map((row) => row.result[0]),
    },
  });

  return {
    stakerAddresses: stakerAddresses?.length > 0 ? stakerAddresses : undefined,
    borrowerAddresses: borrowerAddresses?.length > 0 ? borrowerAddresses : undefined,
    refetch: async () => {
      await refetchCounts();
      await refetchVouchees();
      await refetchVouchers();
    },
  };
}
