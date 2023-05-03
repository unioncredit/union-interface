import {
  mainnet,
  goerli,
  arbitrum,
  optimismGoerli,
  optimism,
} from "wagmi/chains";

export const PermitType = {
  DAI: "dai",
  ERC20: "erc20",
};

export const getPermitMethod = (chainId, method) => {
  const methods = {
    [mainnet.id]: {
      stake: {
        functionName: "stakeWithPermit",
        type: PermitType.DAI,
      },
      repayBorrow: {
        functionName: "repayBorrowWithPermit",
        type: PermitType.DAI,
      },
    },
    [goerli.id]: {
      stake: {
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
      },
      repayBorrow: {
        functionName: "repayBorrowWithPermit",
        type: PermitType.DAI,
      },
    },
    [arbitrum.id]: {
      stake: {
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
      },
      repayBorrow: {
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
      },
    },
    [optimismGoerli.id]: {
      stake: {
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
      },
      repayBorrow: {
        functionName: "repayBorrowWithERC20Permit",
        type: PermitType.ERC20,
      },
      registerMember: {
        functionName: "registerMemberWithPermit",
        type: PermitType.ERC20,
      },
    },
    [optimism.id]: {
      stake: {
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
      },
      repayBorrow: {
        functionName: "repayBorrowWithERC20Permit",
        type: PermitType.ERC20,
      },
      registerMember: {
        functionName: "registerMemberWithPermit",
        type: PermitType.ERC20,
      },
    },
  };

  return methods[chainId][method] ?? method;
};
