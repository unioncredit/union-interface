import { createContext, useContext } from "react";
import { useAccount, useContractReads } from "wagmi";

import {
  STALE_TIME,
  CACHE_TIME,
  DUST_THRESHOLD,
  ZERO,
  ZERO_ADDRESS,
} from "constants";
import { useVersion, Versions } from "./Version";
import useContract from "hooks/useContract";
import { calculateMinPayment } from "utils/numbers";
import usePollMemberData from "hooks/usePollMember";
import useRelatedAddresses from "hooks/useRelatedAddresses";

const selectMemberData = (data) => {
  const [
    isMember = false,
    creditLimit = ZERO,
    stakedBalance = ZERO,
    totalLockedStake = ZERO,
    memberFrozen = ZERO,
    unionBalance = ZERO,
    daiBalance = ZERO,
    unclaimedRewards = ZERO,
    owed = ZERO,
    interest = ZERO,
    lastRepay = ZERO,
    votes = ZERO,
    delegate = ZERO_ADDRESS,
    isOverdue = false,
    // Versioned values
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
    daiBalance,
    unclaimedRewards,
    owed,
    interest,
    lastRepay,
    votes,
    delegate,
    isOverdue,
    minPayment: ZERO,
  };

  if (creditLimit.lt(DUST_THRESHOLD)) {
    result.creditLimit = ZERO;
  }

  if (owed.gt(ZERO)) {
    result.minPayment = calculateMinPayment(interest);
  }

  return result;
};

const MemberContext = createContext({});

export const useMember = () => useContext(MemberContext);

export function useMemberData(address, chainId) {
  const { version } = useVersion();

  const daiContract = useContract("dai", chainId);
  const unionContract = useContract("union", chainId);
  const uTokenContract = useContract("uToken", chainId);
  const userManagerContract = useContract("userManager", chainId);
  const comptrollerContract = useContract("comptroller", chainId);

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
          ...daiContract,
          functionName: "balanceOf",
          args: [address],
        },
        {
          ...comptrollerContract,
          functionName: "calculateRewardsByBlocks",
          args: [address, daiContract.address, ZERO],
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
          ...uTokenContract,
          functionName: "checkIsOverdue",
          args: [address],
        },
        // Versioned values
        ...(version === Versions.V1
          ? [
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
      !!userManagerContract &&
      !!unionContract &&
      !!uTokenContract &&
      !!comptrollerContract,
    select: (data) => selectMemberData(data),
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
  } = useRelatedAddresses(address, chainId);

  return {
    data: { ...data, address, stakerAddresses, borrowerAddresses },
    ...resp,
  };
}

export default function MemberData({
  chainId,
  children,
  address: addressProp,
}) {
  const { address: connectedAddress } = useAccount();

  const address = addressProp || connectedAddress;

  const resp = useMemberData(address, chainId);

  const pollResp = usePollMemberData(address, chainId);

  return (
    <MemberContext.Provider
      value={{ ...resp, data: { ...resp.data, ...pollResp.data } }}
    >
      {children}
    </MemberContext.Provider>
  );
}
