import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { createContext, useContext, useState } from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, optimism } from "wagmi/chains";

// eslint-disable-next-line no-undef
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

// eslint-disable-next-line no-undef
const alchemyKey = process.env.REACT_APP_ALCHEMY_ID;

const NetworkContext = createContext({});

export const useAppNetwork = () => useContext(NetworkContext);

export const base = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`] },
    default: { http: [`https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`] },
  },
  blockExplorers: {
    etherscan: { name: "Block Scount", url: "https://base.blockscout.com" },
    default: { name: "Block Scount", url: "https://base.blockscout.com" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 5022,
    },
  },
};

const baseSepolia = {
  id: 84532,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.base.org"] },
    default: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: {
    etherscan: { name: "Block Scount", url: "https://base-sepolia.blockscout.com" },
    default: { name: "Block Scount", url: "https://base-sepolia.blockscout.com" },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 1_059_647,
    },
  },
};

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, arbitrum, optimism, base, baseSepolia],
  [
    // eslint-disable-next-line no-undef
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Union Credit",
  projectId,
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function Network({ children }) {
  const [forceAppReady, setForceAppReady] = useState(false);

  return (
    <NetworkContext.Provider value={{ forceAppReady, setForceAppReady }}>
      <WagmiConfig client={wagmiClient} persister={null}>
        <RainbowKitProvider
          chains={chains}
          autoConnect={true}
          modalSize="compact"
          initialChain={base.id}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </NetworkContext.Provider>
  );
}
