import { chain } from "wagmi";

export const getPermitMethod = (chainId, method) => {
  const methods = {
    [chain.mainnet.id]: {
      stake: "stakeWithPermit",
      repayBorrow: "repayBorrowWithPermit",
    },
    [chain.goerli.id]: {
      stake: "stakeWithERC20Permit",
      repayBorrow: "repayBorrowWithERC20Permit",
    },
    [chain.arbitrum.id]: {
      stake: "stakeWithERC20Permit",
      repayBorrow: "repayBorrowWithERC20Permit",
    },
  };

  return methods[chainId][method] ?? method;
};
