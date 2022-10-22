import chunk from "lodash/chunk";
import { createContext, useContext, useEffect } from "react";
import { useAccount, useContractReads } from "wagmi";

import { useMember } from "providers/MemberData";
import useContract from "hooks/useContract";

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
  const { data = {} } = useMember();
  const userManagerContract = useContract("userManager");

  const { stakerAddresses } = data;

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
    enables: false,
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
  });

  useEffect(() => {
    address && resp.refetch();
  }, [address]);

  return (
    <VouchersContext.Provider value={resp}>{children}</VouchersContext.Provider>
  );
}
