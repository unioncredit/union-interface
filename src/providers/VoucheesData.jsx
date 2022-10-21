import chunk from "lodash/chunk";
import { createContext, useContext, useEffect } from "react";
import { useAccount, useContractReads } from "wagmi";

import { useMember } from "providers/MemberData";
import useContract from "hooks/useContract";

const VoucheesContext = createContext({});

export const useVouchees = () => useContext(VoucheesContext);

const selectVouchee = (data) => ({
  checkIsMember: data[0],
  locking: data[1].lockedStake,
  trust: data[1].trustAmount,
  vouch: data[1].vouchingAmount,
  isOverdue: data[2],
});

export default function VoucheesData({ children }) {
  const { address } = useAccount();
  const { data = {} } = useMember();

  const uTokenContract = useContract("uToken");
  const userManagerContract = useContract("userManager");

  const { borrowerAddresses } = data;

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
    enables: false,
    select: (data) => {
      const tmp = buildVoucheeQueries(address, address);
      const chunkSize = tmp.length;
      const chunked = chunk(data, chunkSize);

      return chunked.reduce(
        (acc, chunk, i) => ({
          ...acc,
          [borrowerAddresses[i]]: selectVouchee(chunk),
        }),
        {}
      );
    },
    contracts: contracts,
  });

  useEffect(() => {
    address && resp.refetch();
  }, [address]);

  return (
    <VoucheesContext.Provider value={resp}>{children}</VoucheesContext.Provider>
  );
}
