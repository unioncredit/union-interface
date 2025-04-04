import chunk from "lodash/chunk";
import { useAccount, useReadContracts } from "wagmi";
import { createContext, useContext, useEffect } from "react";

import { useMemberData } from "providers/MemberData";
import useContract from "hooks/useContract";
import usePopulateEns from "hooks/usePopulateEns";
import { CACHE_TIME, STALE_TIME, ZERO } from "constants";
import { compareAddresses } from "utils/compare";
import { useVersion, Versions } from "./Version";
import { useToken } from "hooks/useToken";

const VouchersContext = createContext({});

export const useVouchers = () => useContext(VouchersContext);

export const useVoucher = (address) =>
  (useVouchers()?.data ?? []).find((v) => compareAddresses(v.address, address));

const selectVoucher = (version) => (data) => {
  const [checkIsMember = false, stakedBalance = ZERO, info = []] = data || [];

  return {
    checkIsMember,
    stakedBalance,
    ...(version === Versions.V1
      ? {
          locking: info.lockedStake,
          trust: info.trustAmount,
          vouch: info.vouchingAmount,
        }
      : {
          locking: info.voucher.locked,
          trust: info.voucher.trust,
          vouch: info.voucher.vouch,
        }),
  };
};

export const useVouchersData = (address, chainId, forcedVersion) => {
  const { version } = useVersion();
  const { data: member = {} } = useMemberData(address, chainId, forcedVersion);
  const { token } = useToken(chainId);

  const tokenContract = useContract(token.toLowerCase(), chainId, forcedVersion);
  const unionLensContract = useContract("unionLens", chainId, forcedVersion);
  const userManagerContract = useContract("userManager", chainId, forcedVersion);

  const { stakerAddresses } = member;

  const buildVoucherQueries = (borrower, staker) => [
    { ...userManagerContract, functionName: "checkIsMember", args: [staker] },
    {
      ...userManagerContract,
      functionName: "getStakerBalance",
      args: [staker],
    },
    (forcedVersion || version) === Versions.V1
      ? {
          ...userManagerContract,
          functionName: "getBorrowerAsset",
          args: [staker, borrower],
        }
      : {
          ...unionLensContract,
          functionName: "getRelatedInfo",
          args: [tokenContract.address, staker, borrower],
        },
  ];

  const contracts = (stakerAddresses || []).reduce(
    (acc, staker) => [...acc, ...buildVoucherQueries(address, staker)],
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
        const tmp = buildVoucherQueries(address, address);
        const chunkSize = tmp.length;
        const chunked = chunk(
          data.map((d) => d.result),
          chunkSize
        );
        return chunked.map((x, i) => ({
          ...selectVoucher(forcedVersion || version)(x),
          address: stakerAddresses[i],
        }));
      },
    },
  });

  useEffect(() => {
    if (
      tokenContract?.address &&
      userManagerContract.address &&
      address &&
      stakerAddresses?.length > 0
    ) {
      resp.refetch();
    }
  }, [
    tokenContract?.address,
    userManagerContract.address,
    address,
    stakerAddresses?.length,
    resp.refetch,
  ]);

  return { ...resp, data: usePopulateEns(resp.data) };
};

export default function VouchersData({ children }) {
  const { chain, address } = useAccount();
  const data = useVouchersData(address, chain?.id);

  return <VouchersContext.Provider value={{ ...data }}>{children}</VouchersContext.Provider>;
}
