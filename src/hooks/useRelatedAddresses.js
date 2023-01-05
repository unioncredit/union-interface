import { useContractReads } from "wagmi";
import { useVersion, Versions } from "providers/Version";

import useContract from "./useContract";

export default function useRelatedAddresses(address, chainId) {
  const { version } = useVersion();

  const isV2 = version === Versions.V2;

  const userManagerContract = useContract("userManager", chainId);

  const { data: { voucherCount = 0, voucheeCount = 0 } = {} } =
    useContractReads({
      enabled: !!address && !!userManagerContract && isV2,
      select: (data) => ({
        voucherCount: Number(data[0].toString()),
        voucheeCount: Number(data[1].toString()),
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
    });

  const { data: stakerAddresses } = useContractReads({
    enabled: voucherCount > 0,
    select: (data) => data.map((row) => row.staker),
    contracts: Array(voucherCount)
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchers",
        args: [address, i],
      })),
  });

  const { data: borrowerAddresses } = useContractReads({
    enabled: voucheeCount > 0,
    select: (data) => data.map((row) => row.borrower),
    contracts: Array(voucheeCount)
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchees",
        args: [address, i],
      })),
  });

  return { stakerAddresses, borrowerAddresses };
}
