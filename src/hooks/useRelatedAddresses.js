import { useContractReads } from "wagmi";

import useContract from "./useContract";
import { STALE_TIME } from "constants";
import { CACHE_TIME } from "constants";

export default function useRelatedAddresses(address, chainId) {
  const userManagerContract = useContract("userManager", chainId);

  const { data: { voucherCount = 0, voucheeCount = 0 } = {}, refetch: refetchCounts } =
    useContractReads({
      enabled: !!address && !!userManagerContract,
      select: (data) => ({
        voucherCount: Number(data[0]?.toString() || "0"),
        voucheeCount: Number(data[1]?.toString() || "0"),
      }),
      contracts: [
        {
          ...userManagerContract,
          functionName: "getVoucherCount",
          args: [address],
        },
        {
          ...userManagerContract,
          functionName: "getVoucheeCount",
          args: [address],
        },
      ],
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
    });

  const { data: stakerAddresses, refetch: refetchVouchers } = useContractReads({
    enabled: voucherCount > 0,
    select: (data) => data.map((row) => row.staker),
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
  });

  const { data: borrowerAddresses, refetch: refetchVouchees } = useContractReads({
    enabled: voucheeCount > 0,
    select: (data) => data.map((row) => row.borrower),
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
