import { createContext, useContext, useEffect } from "react";

import { userManagerContract, unionContract } from "config/contracts";
import { useAccount, useContractReads } from "wagmi";

const selectUserManager = (data) => ({
  isMember: data[0],
  creditLimit: data[1],
  stakedBalance: data[2],
  totalLockedStake: data[3],
  totalFrozenAmount: data[4],
  memberFrozen: data[5],
  borrowerAddresses: data[6],
  stakerAddresses: data[7],
  unionBalance: data[8],
});

const MemberContext = createContext({});

export const useMember = () => useContext(MemberContext);

export default function MemberData({ children }) {
  const { address } = useAccount();

  const { data: userManagerData, ...userManager } = useContractReads({
    enables: false,
    select: (data) => selectUserManager(data),
    contracts: [
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
        args: [address]
      }
    ],
  });

  useEffect(() => {
    address && userManager.refetch();
  }, [address]);

  return (
    <MemberContext.Provider
      value={{
        data: { ...userManagerData },
        isLoading: !userManagerData || userManagerData.isLoading,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}
