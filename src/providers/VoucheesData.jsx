import chunk from "lodash/chunk";
import { createContext, useContext } from "react";
import { useAccount, useContractReads } from "wagmi";

import { useMember } from "providers/MemberData";
import useContract from "hooks/useContract";
import usePopulateEns from "hooks/usePopulateEns";

const VoucheesContext = createContext({});

export const useVouchees = () => useContext(VoucheesContext);

const selectVouchee = (data) => ({
  isMember: data[0],
  locking: data[1].lockedStake,
  trust: data[1].trustAmount,
  vouch: data[1].vouchingAmount,
  isOverdue: data[2],
});

export default function VoucheesData({ children }) {
  const { address } = useAccount();
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
  ];

  const contracts = (borrowerAddresses || []).reduce(
    (acc, staker) => [...acc, ...buildVoucheeQueries(address, staker)],
    []
  );

  const resp = useContractReads({
    enables: !!address,
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
  });

  const data = usePopulateEns(resp.data);

  return (
    <VoucheesContext.Provider value={{ ...resp, data }}>
      {children}
    </VoucheesContext.Provider>
  );
}
