import { mainnet, arbitrum, optimism } from "wagmi/chains";

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
    [84532]: {
      // tested && working
      stake: {
        functionName: "stakeWithERC20Permit",
        type: PermitType.ERC20,
        domain: {
          name: "USDC",
          version: "2",
          chainId: 84532,
        },
      },
      // tested && working
      repayBorrow: {
        functionName: "repayBorrowWithERC20Permit",
        type: PermitType.ERC20,
        domain: {
          name: "USDC",
          version: "2",
          chainId: 84532,
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
