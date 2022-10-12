import { createContext, useContext, useEffect } from "react";

import { useAccount, useContractReads } from "wagmi";
import useContract from "hooks/useContract";

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
  daiBalance: data[9],
});

const MemberContext = createContext({});

export const useMember = () => useContext(MemberContext);

export default function MemberData({ children }) {
  const { address } = useAccount();

  const daiContract = useContract("dai");
  const unionContract = useContract("union");
  const userManagerContract = useContract("userManager");

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
