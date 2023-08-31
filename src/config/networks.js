import { optimismGoerli } from "wagmi/chains";

export const testNetworkIds = [optimismGoerli.id];

export const networks = [
  {
    type: "optimism",
    id: "optimism",
    imageSrc: "/networks/optimism-avatar.png",
    value: "optimism",
    label: "Optimism",
    labelWithVersion: "Optimism",
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
    labelWithVersion: "Optimism Goerli",
    description: "Use Union on a testnet",
    avatar: "/networks/gorli-avatar.png",
    chainId: 420,
    networkData: {
      chainId: "0x1A4",
    },
  },
];
