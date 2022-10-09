import chunk from "lodash/chunk";
import { createContext, useContext } from "react";
import { useAccount, useContractReads } from "wagmi";

import { useMember } from "providers/MemberData";
import { userManagerContract } from "config/contracts";

const VouchersContext = createContext({});

export const useVouchers = () => useContext(VouchersContext);

const buildVoucherQueries = (borrower, staker) => [
  { ...userManagerContract, functionName: "checkIsMember", args: [staker] },
  {
    ...userManagerContract,
    functionName: "getStakerAsset",
    args: [borrower, staker],
  },
];

const selectVoucher = (data) => ({
  checkIsMember: data[0],
  trust: data[1].trustAmount,
});

export default function VouchersData({ children }) {
  const { address } = useAccount();
  const { data = {} } = useMember();

  const { getStakerAddresses } = data;

  const contracts = getStakerAddresses.reduce(
    (acc, staker) => [...acc, ...buildVoucherQueries(address, staker)],
    []
  );

  const resp = useContractReads({
    enables: false,
    contracts: contracts,
  });

  const tmp = buildVoucherQueries(address, address);
  const chunkSize = tmp.length;
  const chunked = resp.data ? chunk(resp.data, chunkSize) : [];
  const voucherData =
    chunked.length > 0
      ? chunked.reduce(
          (acc, chunk, i) => ({
            ...acc,
            [getStakerAddresses[i]]: selectVoucher(chunk),
          }),
          {}
        )
      : [];

  return (
    <VouchersContext.Provider value={{ ...resp, data: voucherData }}>
      {children}
    </VouchersContext.Provider>
  );
}
