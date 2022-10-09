import { createContext, useContext, useEffect } from "react";

import { userManagerContract } from "config/contracts";
import { useAccount, useContractReads } from "wagmi";

const selectUserManager = (data) => ({
  checkIsMember: data[0],
  getCreditLimit: data[1],
  getStakerBalance: data[2],
  getTotalLockedStake: data[3],
  getTotalFrozenAmount: data[4],
  memberFrozen: data[5],
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
