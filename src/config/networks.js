export const testNetworkIds = [84532];

export const unsupportedNetwork = {
  type: "unsupported",
  id: "unsupported",
  imageSrc: "/networks/unsupported.png",
  value: "unsupported",
  label: "Unsupported",
  labelWithVersion: "Unsupported",
  description: "This is an unsupported network",
  avatar: "/networks/unsupported.png",
  chainId: 0,
  networkData: {
    chainId: "0x0",
  },
};

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
    type: "ethereum",
    id: "ethereum",
    imageSrc: "/networks/ethereum.png",
    value: "ethereum",
    label: "Ethereum",
    labelWithVersion: "Ethereum (GOV)",
    description: "Use Union on Mainnet",
    avatar: "/networks/ethereum-avatar.png",
    chainId: 1,
    networkData: {
      chainId: "0x1",
    },
  },
  {
    type: "base",
    id: "base",
    imageSrc: "/networks/gorli.png",
    value: "base",
    label: "Base",
    labelWithVersion: "Base (v2)",
    description: "Use Union on base mainnet",
    avatar: "/networks/gorli-avatar.png",
    chainId: 8453,
    networkData: {
      chainId: "0x2105",
    },
  },
  {
    type: "base-sepolia",
    id: "base-sepolia",
    imageSrc: "/networks/gorli.png",
    value: "base-sepolia",
    label: "Base Sepolia",
    labelWithVersion: "Base Sepolia (v2)",
    description: "Use Union on a testnet",
    avatar: "/networks/gorli-avatar.png",
    chainId: 84532,
    networkData: {
      chainId: "0x14A34",
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
];
