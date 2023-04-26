import chunk from "lodash/chunk";
import { useAccount, useContractReads } from "wagmi";
import { createContext, useContext, useEffect } from "react";

import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import usePopulateEns from "hooks/usePopulateEns";
import { ZERO, STALE_TIME, CACHE_TIME } from "constants";
import { useVersion, Versions } from "./Version";

const VoucheesContext = createContext({});

export const useVouchees = () => useContext(VoucheesContext);

const selectVouchee = (version) => (data) => ({
  isMember: data[0],
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
  isOverdue: data[2],
  interest: data[3] || ZERO,
  lastRepay: data[4],
});

export default function VoucheesData({ children }) {
  const { version } = useVersion();
  const { data: member = {} } = useMember();
  const { address, isConnected } = useAccount();

  const daiContract = useContract("dai");
  const unionLens = useContract("unionLens");
  const uTokenContract = useContract("uToken");
  const userManagerContract = useContract("userManager");

  const { borrowerAddresses } = member;

  const buildVoucheeQueries = (staker, borrower) => [
    { ...userManagerContract, functionName: "checkIsMember", args: [borrower] },
    version === Versions.V1
      ? {
          ...userManagerContract,
          functionName: "getBorrowerAsset",
          args: [staker, borrower],
        }
      : {
          ...unionLens,
          functionName: "getRelatedInfo",
          args: [daiContract.address, staker, borrower],
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
        ...selectVouchee(version)(chunk),
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
