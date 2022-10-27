import { createContext, useContext, useEffect } from "react";

import { useAccount, useContractReads, chain } from "wagmi";
import useContract from "hooks/useContract";
import { ZERO, ZERO_ADDRESS } from "constants";

const selectUserManager = (data) => ({
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
  interest: data[12] || ZERO,
  lastRepay: data[13] || ZERO,
  votes: data[14] || ZERO,
  delegate: data[15] || ZERO_ADDRESS,
});

const MemberContext = createContext({});

export const useMember = () => useContext(MemberContext);

export default function MemberData({ children, address: addressProp }) {
  const { address: connectedAddress } = useAccount();

  const address = addressProp || connectedAddress;

  const daiContract = useContract("dai");
  const unionContract = useContract("union");
  const uTokenContract = useContract("uToken");
  const userManagerContract = useContract("userManager");
  const comptrollerContract = useContract("comptroller");

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
    enables: false,
    select: (data) => selectUserManager(data),
    contracts,
  });

  useEffect(() => {
    address && userManager.refetch();
  }, [address]);

  return (
    <MemberContext.Provider
      value={{
        refetch: () => userManager.refetch(),
        data: { ...userManagerData },
        isLoading: !userManagerData || userManagerData.isLoading,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}
