import chunk from "lodash/chunk";
import { useAccount, useReadContracts } from "wagmi";
import { createContext, useContext, useEffect } from "react";

import useContract from "hooks/useContract";
import { useMemberData } from "providers/MemberData";
import usePopulateEns from "hooks/usePopulateEns";
import { CACHE_TIME, STALE_TIME, ZERO } from "constants";
import { compareAddresses } from "utils/compare";
import { useVersion, Versions } from "./Version";
import { useToken } from "hooks/useToken";

const VoucheesContext = createContext({});

export const useVouchees = () => useContext(VoucheesContext);

export const useVouchee = (address) =>
  (useVouchees()?.data ?? []).find((v) => compareAddresses(v.address, address));

// Every field is read defensively. wagmi's `allowFailure` default yields
// `result: undefined` for any reverted or failed sub-call, and this ran inside
// react-query's `select` — so a single failing entry (transient RPC error, a
// contract/chain mismatch for one staker) threw a TypeError that errored the whole
// query and made the ENTIRE providing/receiving contact list disappear, instead of
// degrading the one affected row.
export const selectVouchee = (version) => (data) => {
  const [isMember = false, info, isOverdue = false, interest, lastRepay] = data || [];

  const related =
    version === Versions.V1
      ? {
          locking: info?.lockedStake ?? ZERO,
          trust: info?.trustAmount ?? ZERO,
          vouch: info?.vouchingAmount ?? ZERO,
        }
      : {
          locking: info?.voucher?.locked ?? ZERO,
          trust: info?.voucher?.trust ?? ZERO,
          vouch: info?.voucher?.vouch ?? ZERO,
        };

  return {
    isMember,
    ...related,
    isOverdue,
    interest: interest ?? ZERO,
    lastRepay: lastRepay ?? ZERO,
  };
};

export const useVoucheesData = (address, chainId, forcedVersion) => {
  const { version } = useVersion();
  const { data: member = {} } = useMemberData(address, chainId, forcedVersion);
  const { token } = useToken(chainId);

  const tokenContract = useContract(token.toLowerCase(), chainId, forcedVersion);
  const unionLens = useContract("unionLens", chainId, forcedVersion);
  const uTokenContract = useContract("uToken", chainId, forcedVersion);
  const userManagerContract = useContract("userManager", chainId, forcedVersion);

  const { borrowerAddresses } = member;

  const buildVoucheeQueries = (staker, borrower) => [
    { ...userManagerContract, functionName: "checkIsMember", args: [borrower] },
    (forcedVersion || version) === Versions.V1
      ? {
          ...userManagerContract,
          functionName: "getBorrowerAsset",
          args: [staker, borrower],
        }
      : {
          ...unionLens,
          functionName: "getRelatedInfo",
          args: [tokenContract.address, staker, borrower],
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

  const resp = useReadContracts({
    contracts: contracts.map((contract) => ({
      ...contract,
      chainId,
    })),

    query: {
      enabled: false,
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      select: (data) => {
        const tmp = buildVoucheeQueries(address, address);
        const chunkSize = tmp.length;
        const chunked = chunk(
          data.map((d) => d.result),
          chunkSize
        );

        return chunked.map((chunk, i) => ({
          ...selectVouchee(forcedVersion || version)(chunk),
          address: borrowerAddresses[i],
        }));
      },
    },
  });

  useEffect(() => {
    if (address && borrowerAddresses?.length > 0) resp.refetch();
  }, [address, resp.refetch, borrowerAddresses?.length]);

  return { ...resp, data: usePopulateEns(resp.data) };
};

export default function VoucheesData({ children }) {
  const { chain, address } = useAccount();
  const data = useVoucheesData(address, chain?.id);

  return <VoucheesContext.Provider value={{ ...data }}>{children}</VoucheesContext.Provider>;
}
