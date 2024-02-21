import { useAccount, useContractReads, useNetwork } from "wagmi";
import { createContext, useContext } from "react";

import { CACHE_TIME, STALE_TIME, ZERO, ZERO_ADDRESS } from "constants";
import useContract from "hooks/useContract";
import { calculateMinPayment } from "utils/numbers";
import usePollMemberData from "hooks/usePollMember";
import { isVersionSupported, Versions } from "./Version";

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
    rewardsMultiplier = ZERO,
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
    unclaimedRewards: unclaimedRewards || ZERO,
    owed,
    interest,
    lastRepay,
    votes: votes || ZERO,
    delegate,
    isOverdue,
    minPayment: ZERO,
    rewardsMultiplier,
  };

  if (owed.gt(ZERO)) {
    result.minPayment = calculateMinPayment(interest);
  }

  return result;
};

const MemberContext = createContext({});

export const useMember = () => useContext(MemberContext);

export function useMemberData(address, chainIdProp, forceVersion) {
  const { chain: connectedChain } = useNetwork();

  const chainId = chainIdProp || connectedChain?.id;
  const daiContract = useContract("dai", chainId, forceVersion);
  const unionContract = useContract("union", chainId, forceVersion);
  const uTokenContract = useContract("uToken", chainId, forceVersion);
  const userManagerContract = useContract("userManager", chainId, forceVersion);
  const comptrollerContract = useContract("comptroller", chainId, forceVersion);

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
        {
          ...comptrollerContract,
          functionName: "getRewardsMultiplier",
          args: [address, daiContract.address],
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
    : [];

  const { data, ...resp } = useContractReads({
    enabled:
      isVersionSupported(Versions.V1, chainId) &&
      !!address &&
      !!daiContract?.address &&
      !!userManagerContract?.address &&
      !!unionContract?.address &&
      !!uTokenContract?.address &&
      !!comptrollerContract?.address,
    select: (data) => selectMemberData(data),
    contracts: contracts.map((contract) => ({
      ...contract,
      chainId: chainId,
    })),
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });

  return {
    data: {
      ...data,
      address,
    },
    ...resp,
    refetch: async () => {
      await resp.refetch();
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
