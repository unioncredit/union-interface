export const networks = [
  {
    type: "ethereum",
    id: "ethereum",
    imageSrc: "/networks/ethereum.png",
    value: "ethereum",
    label: "Ethereum",
    description: "Use Union on Mainnet",
    avatar: "/networks/ethereum-avatar.png",
    chainId: 1,
    networkData: {
      chainId: "0x1",
    },
  },
  {
    label: "Arbitrum",
    type: "arbitrum",
    id: "arbitrum",
    imageSrc: "/networks/arbitrum.png",
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
    description: "Use Union on a testnet",
    avatar: "/networks/gorli-avatar.png",
    chainId: 5,
    networkData: {
      chainId: "0x5",
    },
  },
  {
    type: "optimismGoerli",
    id: "optimismGoerli",
    imageSrc: "/networks/gorli.png",
    value: "optimismGoerli",
    label: "OptimismGoerli",
    description: "Use Union on a testnet",
    avatar: "/networks/gorli-avatar.png",
    chainId: 420,
    networkData: {
      chainId: "0x1a4",
      rpcUrls: ["https://goerli.optimism.io"],
      chainName: "goerli optimism",
    },
  },
];
