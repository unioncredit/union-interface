import chunk from "lodash/chunk";
import { useAccount, useContractReads } from "wagmi";
import { createContext, useContext, useEffect } from "react";

import { useMember } from "providers/MemberData";
import useContract from "hooks/useContract";
import usePopulateEns from "hooks/usePopulateEns";
import { CACHE_TIME } from "constants";
import { STALE_TIME } from "constants";
import { useVersion, Versions } from "./Version";

const VouchersContext = createContext({});

export const useVouchers = () => useContext(VouchersContext);

const selectVoucher = (version) => (data) => ({
  checkIsMember: data[0],
  ...(version === Versions.V1
    ? {
        locking: data[1].lockedStake,
        trust: data[1].trustAmount,
        vouch: data[1].vouchingAmount,
      }
    : {
        locking: data[1].voucher.locked,
        trust: data[1].voucher.trust,
        vouch: data[1].voucher.vouch,
      }),
});

export default function VouchersData({ children }) {
  const { version } = useVersion();
  const { address } = useAccount();
  const { data: member = {} } = useMember();

  const daiContract = useContract("dai");
  const userManagerContract = useContract("userManager");

  const { stakerAddresses } = member;

  const buildVoucherQueries = (borrower, staker) => [
    { ...userManagerContract, functionName: "checkIsMember", args: [staker] },
    version === Versions.V1
      ? {
          ...userManagerContract,
          functionName: "getBorrowerAsset",
          args: [staker, borrower],
        }
      : {
          ...unionLens,
          functionName: "getRelatedInfo",
          args: [daiContract.addressOrName, staker, borrower],
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
    if (address && stakerAddresses?.length > 0) resp.refetch();
  }, [address, stakerAddresses?.length, resp.refetch]);

  const data = usePopulateEns(resp.data);

  return (
    <VouchersContext.Provider value={{ ...resp, data }}>
      {children}
    </VouchersContext.Provider>
  );
}
