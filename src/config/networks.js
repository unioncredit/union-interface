export const networks = [
  {
    type: "ethereum",
    id: "ethereum",
    imageSrc: "/networks/ethereum.png",
    value: "ethereum",
    label: "Ethereum",
    description: "Use Union on Ethereum’s main network",
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
    label: "Arbitrum",
    description: "Use Arbitrum’s L2 to manage your credit",
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
    description: "Use Union on goerli for testing",
    avatar: "/networks/gorli-avatar.png",
    chainId: 5,
    networkData: {
      chainId: "0x5",
    },
  },
];
