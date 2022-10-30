import { useAccount, useContractReads } from "wagmi";
import { createContext, useContext } from "react";

import useContract from "hooks/useContract";
import { ZERO, ZERO_ADDRESS } from "constants";
import { calculateMinPayment } from "utils/numbers";

const selectUserManager = (data) => {
  const interest = data[12] || ZERO;

  return {
    isMember: data[0] || false,
    creditLimit: data[1] || ZERO,
    stakedBalance: data[2] || ZERO,
    totalLockedStake: data[3] || ZERO,
    totalFrozenAmount: data[4] || ZERO,
    memberFrozen: data[5] || ZERO,
    borrowerAddresses: data[6] || [],
    stakerAddresses: data[7] || [],
    unionBalance: data[8] || ZERO,
    daiBalance: data[9] || ZERO,
    unclaimedRewards: data[10] || ZERO,
    owed: data[11] || ZERO,
    interest,
    lastRepay: data[13] || ZERO,
    votes: data[14] || ZERO,
    delegate: data[15] || ZERO_ADDRESS,
    // calculated values
    minPayment: calculateMinPayment(interest || ZERO),
  };
};

const MemberContext = createContext({});

export const useMember = () => useContext(MemberContext);

export default function MemberData({
  chainId,
  children,
  address: addressProp,
}) {
  const { address: connectedAddress } = useAccount();

  const address = addressProp || connectedAddress;

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
          functionName: "getTotalFrozenAmount",
          args: [address],
        },
        {
          ...userManagerContract,
          functionName: "memberFrozen",
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
          args: [address, daiContract.addressOrName, ZERO],
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
      ]
    : [];

  const { data: userManagerData, ...userManager } = useContractReads({
    enabled: !!address,
    select: (data) => selectUserManager(data),
    contracts: contracts.map((contract) => ({
      ...contract,
      chainId,
    })),
  });

  return (
    <MemberContext.Provider
      value={{
        refetch: userManager,
        isLoading: !userManagerData || userManagerData.isLoading,
        data: userManagerData,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}
