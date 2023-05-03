import chunk from "lodash/chunk";
import { useAccount, useContractReads } from "wagmi";
import { createContext, useContext, useEffect } from "react";

import { useMember } from "providers/MemberData";
import useContract from "hooks/useContract";
import usePopulateEns from "hooks/usePopulateEns";
import { STALE_TIME, CACHE_TIME, ZERO } from "constants";
import { compareAddresses } from "utils/compare";
import { useVersion, Versions } from "./Version";

const VouchersContext = createContext({});

export const useVouchers = () => useContext(VouchersContext);

export const useVoucher = (address) =>
  (useVouchers()?.data ?? []).find((v) => compareAddresses(v.address, address));

const selectVoucher = (version) => (data) => {
  const [checkIsMember = false, stakedBalance = ZERO, info = []] = data || [];

  return {
    checkIsMember,
    stakedBalance,
    ...(version === Versions.V1
      ? {
          locking: info.lockedStake,
          trust: info.trustAmount,
          vouch: info.vouchingAmount,
        }
      : {
          locking: info.voucher.locked,
          trust: info.voucher.trust,
          vouch: info.voucher.vouch,
        }),
  };
};

export default function VouchersData({ children }) {
  const { version } = useVersion();
  const { address } = useAccount();
  const { data: member = {} } = useMember();

  const daiContract = useContract("dai");
  const unionLensContract = useContract("unionLens");
  const userManagerContract = useContract("userManager");

  const { stakerAddresses } = member;

  const buildVoucherQueries = (borrower, staker) => [
    { ...userManagerContract, functionName: "checkIsMember", args: [staker] },
    {
      ...userManagerContract,
      functionName: "getStakerBalance",
      args: [staker],
    },
    version === Versions.V1
      ? {
          ...userManagerContract,
          functionName: "getBorrowerAsset",
          args: [staker, borrower],
        }
      : {
          ...unionLensContract,
          functionName: "getRelatedInfo",
          args: [daiContract.address, staker, borrower],
        },
  ];

  const contracts = (stakerAddresses || []).reduce(
    (acc, staker) => [...acc, ...buildVoucherQueries(address, staker)],
    []
  );

  const resp = useContractReads({
    enabled: false,
    select: (data) => {
      const tmp = buildVoucherQueries(address, address);
      const chunkSize = tmp.length;
      const chunked = chunk(data, chunkSize);
      return chunked.map((x, i) => ({
        ...selectVoucher(version)(x),
        address: stakerAddresses[i],
      }));
    },
    contracts: contracts,
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });

  useEffect(() => {
    if (
      daiContract?.address &&
      userManagerContract.address &&
      address &&
      stakerAddresses?.length > 0
    ) {
      resp.refetch();
    }
  }, [
    daiContract?.address,
    userManagerContract.address,
    address,
    stakerAddresses?.length,
    resp.refetch,
  ]);

  const data = usePopulateEns(resp.data);

  return (
    <VouchersContext.Provider value={{ ...resp, data }}>
      {children}
    </VouchersContext.Provider>
  );
}
