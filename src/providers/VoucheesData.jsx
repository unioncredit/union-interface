import chunk from "lodash/chunk";
import { useAccount, useContractReads, useNetwork } from "wagmi";
import { createContext, useContext, useEffect } from "react";

import useContract from "hooks/useContract";
import { useMemberData } from "providers/MemberData";
import usePopulateEns from "hooks/usePopulateEns";
import { CACHE_TIME, STALE_TIME, ZERO } from "constants";
import { compareAddresses } from "utils/compare";
import { useSettings } from "providers/Settings";
import { useVersion, Versions } from "./Version";

const VoucheesContext = createContext({});

export const useVouchees = () => useContext(VoucheesContext);

export const useVouchee = (address) =>
  (useVouchees()?.data ?? []).find((v) => compareAddresses(v.address, address));

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

export const useVoucheesData = (address, chainId, forcedVersion) => {
  const { version } = useVersion();
  const { data: member = {} } = useMemberData(address, chainId, forcedVersion);
  const {
    settings: { useToken },
  } = useSettings();

  const tokenContract = useContract(useToken.toLowerCase(), chainId, forcedVersion);
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

  const resp = useContractReads({
    enabled: false,
    select: (data) => {
      const tmp = buildVoucheeQueries(address, address);
      const chunkSize = tmp.length;
      const chunked = chunk(data, chunkSize);

      return chunked.map((chunk, i) => ({
        ...selectVouchee(forcedVersion || version)(chunk),
        address: borrowerAddresses[i],
      }));
    },
    contracts: contracts.map((contract) => ({
      ...contract,
      chainId,
    })),
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });

  useEffect(() => {
    if (address && borrowerAddresses?.length > 0) resp.refetch();
  }, [address, resp.refetch, borrowerAddresses?.length]);

  return { ...resp, data: usePopulateEns(resp.data) };
};

export default function VoucheesData({ children }) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const data = useVoucheesData(address, chain?.id);

  return <VoucheesContext.Provider value={{ ...data }}>{children}</VoucheesContext.Provider>;
}
