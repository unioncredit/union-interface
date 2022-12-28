import chunk from "lodash/chunk";
import { useAccount, useContractReads } from "wagmi";
import { createContext, useContext, useEffect } from "react";

import { useMember } from "providers/MemberData";
import useContract from "hooks/useContract";
import usePopulateEns from "hooks/usePopulateEns";
import { CACHE_TIME } from "constants";
import { STALE_TIME } from "constants";

const VouchersContext = createContext({});

export const useVouchers = () => useContext(VouchersContext);

const selectVoucher = (data) => ({
  checkIsMember: data[0],
  trust: data[1].trustAmount,
  vouch: data[1].vouchingAmount,
  locked: data[1].lockedStake,
});

export default function VouchersData({ children }) {
  const { address } = useAccount();
  const { data: member = {} } = useMember();
  const userManagerContract = useContract("userManager");

  const { stakerAddresses } = member;

  const buildVoucherQueries = (borrower, staker) => [
    { ...userManagerContract, functionName: "checkIsMember", args: [staker] },
    {
      ...userManagerContract,
      functionName: "getStakerAsset",
      args: [borrower, staker],
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
        ...selectVoucher(x),
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
