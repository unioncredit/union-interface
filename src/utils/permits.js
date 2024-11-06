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
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
      },
      repayBorrow: {
        functionName: "repayBorrowWithPermit",
        type: PermitType.DAI,
      },
      registerMember: {
        functionName: "registerMemberWithPermit",
        type: PermitType.ERC20,
      },
    },
    [arbitrum.id]: {
      // tested && working
      stake: {
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
        domain: {
          name: "Dai Stablecoin",
          version: "2",
          chainId: arbitrum.id,
        },
      },
      // tested && working
      repayBorrow: {
        functionName: "repayBorrowWithERC20Permit",
        type: PermitType.ERC20,
        domain: {
          name: "Dai Stablecoin",
          version: "2",
          chainId: arbitrum.id,
        },
      },
      registerMember: {
        functionName: "registerMemberWithPermit",
        type: PermitType.ERC20,
      },
    },
    [goerli.id]: {
      // tested && working
      stake: {
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
      },
      // maybe invalid?
      repayBorrow: {
        functionName: "repayBorrowWithPermit",
        type: PermitType.DAI,
      },
      // maybe invalid?
      registerMember: {
        functionName: "registerMemberWithPermit",
        type: PermitType.DAI,
      },
    },
    [optimismGoerli.id]: {
      // tested && working
      stake: {
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
      },
      // tested && working
      repayBorrow: {
        functionName: "repayBorrowWithERC20Permit",
        type: PermitType.ERC20,
      },
      // tested && working
      registerMember: {
        functionName: "registerMemberWithPermit",
        type: PermitType.ERC20,
      },
    },
    [optimism.id]: {
      // tested && working
      stake: {
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
        domain: {
          name: "Dai Stablecoin",
          version: "2",
          chainId: optimism.id,
        },
      },
      // tested && working
      repayBorrow: {
        functionName: "repayBorrowWithERC20Permit",
        type: PermitType.ERC20,
        domain: {
          name: "Dai Stablecoin",
          version: "2",
          chainId: optimism.id,
        },
      },
      // tested && working
      registerMember: {
        functionName: "registerMemberWithPermit",
        type: PermitType.ERC20,
      },
    },
  };

  return methods[chainId][method] ?? method;
};
