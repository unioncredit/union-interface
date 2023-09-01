import { optimismGoerli } from "wagmi/chains";

export const testNetworkIds = [optimismGoerli.id];

// The supported V2 networks
export const supportedNetworks = [
  {
    type: "optimism",
    id: "optimism",
    imageSrc: "/networks/optimism-avatar.png",
    value: "optimism",
    label: "Optimism",
    labelWithVersion: "Optimism (v2)",
    description: "Use Union on optimism mainnet",
    avatar: "/networks/optimism-avatar.png",
    chainId: 10,
    networkData: {
      chainId: "0xa",
    },
  },
  {
    type: "optimism-goerli",
    id: "optimism-goerli",
    imageSrc: "/networks/gorli.png",
    value: "optimism-goerli",
    label: "Optimism Goerli",
    labelWithVersion: "Optimism Goerli (v2)",
    description: "Use Union on a testnet",
    avatar: "/networks/gorli-avatar.png",
    chainId: 420,
    networkData: {
      chainId: "0x1A4",
    },
  },
  {
    type: "ethereum",
    id: "ethereum",
    imageSrc: "/networks/ethereum.png",
    value: "ethereum",
    label: "Ethereum",
    labelWithVersion: "Ethereum (v1)",
    description: "Use Union on Mainnet",
    avatar: "/networks/ethereum-avatar.png",
    chainId: 1,
    networkData: {
      chainId: "0x1",
    },
  },
];

// Consists of all networks for both V1 and V2
// Useful for protocol data/governance etc
export const allNetworks = [
  ...supportedNetworks,
  {
    label: "Arbitrum",
    labelWithVersion: "Arbitrum (v1)",
    type: "arbitrum",
    id: "arbitrum",
    imageSrc: "/networks/arbitrum-avatar.png",
    value: "arbitrum one",
    description: "Use Arbitrum’s L2",
    avatar: "/networks/arbitrum-avatar.png",
    chainId: 42161,
    networkData: {
      chainId: "0xA4B1",
      rpcUrls: ["https://arb1.arbitrum.io/rpc"],
      chainName: "Arbitrum One",
    },
  },
  {
    type: "goerli",
    id: "goerli",
    imageSrc: "/networks/gorli.png",
    value: "goerli",
    label: "Goerli",
    labelWithVersion: "Goerli (v1)",
    description: "Use Union on a testnet",
    avatar: "/networks/gorli-avatar.png",
    chainId: 5,
    networkData: {
      chainId: "0x5",
    },
  },
];
