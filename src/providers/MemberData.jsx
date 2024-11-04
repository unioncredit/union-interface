import { useAccount, useContractReads } from "wagmi";
import { createContext, useContext } from "react";

import { CACHE_TIME, STALE_TIME, ZERO, ZERO_ADDRESS } from "constants";
import { useVersion, Versions } from "./Version";
import useContract from "hooks/useContract";
import { calculateMinPayment } from "utils/numbers";
import usePollMemberData from "hooks/usePollMember";
import useRelatedAddresses from "hooks/useRelatedAddresses";
import { useToken } from "hooks/useToken";

const selectMemberData = (data, useToken) => {
  const [
    isMember = false,
    creditLimit = ZERO,
    stakedBalance = ZERO,
    totalLockedStake = ZERO,
    memberFrozen = ZERO,
    unionBalance = ZERO,
    tokenBalance = ZERO,
    unclaimedRewards = ZERO,
    owed = ZERO,
    interest = ZERO,
    lastRepay = ZERO,
    isOverdue = false,
    rewardsMultiplier = ZERO,
    referrer = ZERO_ADDRESS,
    // Versioned values
    votes = ZERO,
    delegate = ZERO_ADDRESS,
    totalFrozenAmount = ZERO,
    borrowerAddresses = [],
    stakerAddresses = [],
  ] = data || [];

  const result = {
    isMember,
    creditLimit,
    stakedBalance,
    totalLockedStake,
    totalFrozenAmount,
    memberFrozen,
    borrowerAddresses,
    stakerAddresses,
    unionBalance,
    tokenBalance,
    unclaimedRewards,
    owed,
    interest,
    lastRepay,
    referrer,
    votes: votes || ZERO,
    delegate,
    isOverdue,
    minPayment: ZERO,
    rewardsMultiplier,
  };

  if (owed.gt(ZERO)) {
    result.minPayment = calculateMinPayment(interest, useToken);
  }

  return result;
};

const MemberContext = createContext({});

export const useMember = () => useContext(MemberContext);

export function useMemberData(address, chainId, forceVersion) {
  const { version } = useVersion();
  const { token } = useToken(chainId);

  const tokenContract = useContract(token.toLowerCase(), chainId, forceVersion);

  const unionContract = useContract("union", chainId, forceVersion);
  const uTokenContract = useContract("uToken", chainId, forceVersion);
  const userManagerContract = useContract("userManager", chainId, forceVersion);
  const comptrollerContract = useContract("comptroller", chainId, forceVersion);
  const referralContract = useContract("referral", chainId, forceVersion);

  const contracts = address
    ? [
        {
          ...userManagerContract,
          functionName: "checkIsMember",
          args: [address],
        },
        {
          ...userManagerContract,
          functionName: "getCreditLimit",
          args: [address],
        },
        {
          ...userManagerContract,
          functionName: "getStakerBalance",
          args: [address],
        },
        {
          ...userManagerContract,
          functionName: "getTotalLockedStake",
          args: [address],
        },
        {
          ...userManagerContract,
          functionName: "memberFrozen",
          args: [address],
        },
        {
          ...unionContract,
          functionName: "balanceOf",
          args: [address],
        },
        {
          ...tokenContract,
          functionName: "balanceOf",
          args: [address],
        },
        {
          ...comptrollerContract,
          functionName:
            (forceVersion || version) === Versions.V1
              ? "calculateRewardsByBlocks"
              : "calculateRewards",
          args:
            (forceVersion || version) === Versions.V1
              ? [address, tokenContract.address, ZERO]
              : [address, tokenContract.address],
        },
        {
          ...uTokenContract,
          functionName: "borrowBalanceView",
          args: [address],
        },
        {
          ...uTokenContract,
          functionName: "calculatingInterest",
          args: [address],
        },
        {
          ...uTokenContract,
          functionName: "getLastRepay",
          args: [address],
        },
        {
          ...uTokenContract,
          functionName: "checkIsOverdue",
          args: [address],
        },
        {
          ...comptrollerContract,
          functionName: "getRewardsMultiplier",
          args: [address, tokenContract.address],
        },
        {
          ...referralContract,
          functionName: "referrers",
          args: [address],
        },
        // Versioned values
        ...((forceVersion || version) === Versions.V1
          ? [
              {
                ...unionContract,
                functionName: "getCurrentVotes",
                args: [address],
              },
              {
                ...unionContract,
                functionName: "delegates",
                args: [address],
              },
              {
                ...userManagerContract,
                functionName: "getTotalFrozenAmount",
                args: [address],
              },
              {
                ...userManagerContract,
                functionName: "getBorrowerAddresses",
                args: [address],
              },
              {
                ...userManagerContract,
                functionName: "getStakerAddresses",
                args: [address],
              },
            ]
          : []),
      ]
    : [];

  const { data, ...resp } = useContractReads({
    enabled:
      !!address &&
      !!tokenContract?.address &&
      !!userManagerContract?.address &&
      !!unionContract?.address &&
      !!uTokenContract?.address &&
      !!comptrollerContract?.address,
    select: (data) => selectMemberData(data, useToken),
    contracts: contracts.map((contract) => ({
      ...contract,
      chainId,
    })),
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });

  const {
    stakerAddresses = data?.stakerAddresses,
    borrowerAddresses = data?.borrowerAddresses,
    refetch: refetchRelated,
  } = useRelatedAddresses(address, chainId, forceVersion);

  return {
    data: {
      ...data,
      address,
      stakerAddresses,
      borrowerAddresses,
    },
    ...resp,
    refetch: async () => {
      await resp.refetch();
      await refetchRelated();
    },
  };
}

export default function MemberData({ chainId, children, address: addressProp }) {
  const { address: connectedAddress } = useAccount();

  const address = addressProp || connectedAddress;

  const resp = useMemberData(address, chainId);

  const pollResp = usePollMemberData(address, chainId);

  return (
    <MemberContext.Provider value={{ ...resp, data: { ...resp.data, ...pollResp.data } }}>
      {children}
    </MemberContext.Provider>
  );
}
