import chunk from "lodash/chunk";
import { useAccount, useContractReads } from "wagmi";
import { createContext, useContext, useEffect } from "react";

import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import usePopulateEns from "hooks/usePopulateEns";
import { ZERO, STALE_TIME, CACHE_TIME } from "constants";

const VoucheesContext = createContext({});

export const useVouchees = () => useContext(VoucheesContext);

const selectVouchee = (data) => ({
  isMember: data[0],
  locking: data[1].lockedStake,
  trust: data[1].trustAmount,
  vouch: data[1].vouchingAmount,
  isOverdue: data[2],
  interest: data[3] || ZERO,
  lastRepay: data[4],
});

export default function VoucheesData({ children }) {
  const { address, isConnected } = useAccount();
  const { data: member = {} } = useMember();

  const uTokenContract = useContract("uToken");
  const userManagerContract = useContract("userManager");

  const { borrowerAddresses } = member;

  const buildVoucheeQueries = (staker, borrower) => [
    { ...userManagerContract, functionName: "checkIsMember", args: [borrower] },
    {
      ...userManagerContract,
      functionName: "getBorrowerAsset",
      args: [staker, borrower],
    },
    {
      ...uTokenContract,
      functionName: "checkIsOverdue",
      args: [borrower],
    },
    {
      ...uTokenContract,
      functionName: "calculatingInterest",
      args: [borrower],
    },
    {
      ...uTokenContract,
      functionName: "getLastRepay",
      args: [borrower],
    },
  ];

  const contracts = (borrowerAddresses || []).reduce(
    (acc, staker) => [...acc, ...buildVoucheeQueries(address, staker)],
    []
  );

  const resp = useContractReads({
    enabled: false,
    select: (data) => {
      const tmp = buildVoucheeQueries(address, address);
      const chunkSize = tmp.length;
      const chunked = chunk(data, chunkSize);

      return chunked.map((chunk, i) => ({
        ...selectVouchee(chunk),
        address: borrowerAddresses[i],
      }));
    },
    contracts: contracts,
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });

  useEffect(() => {
    if (address && isConnected && borrowerAddresses?.length > 0) resp.refetch();
  }, [address, resp.refetch, borrowerAddresses?.length, isConnected]);

  const data = usePopulateEns(resp.data);

  return (
    <VoucheesContext.Provider value={{ ...resp, data }}>
      {children}
    </VoucheesContext.Provider>
  );
}
