import {
  walletConnectWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createContext, useContext, useEffect, useState } from "react";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  chain,
  WagmiConfig,
  createClient,
  configureChains,
  useNetwork,
  useAccount,
} from "wagmi";
import { switchNetwork } from "@wagmi/core";

const NetworkContext = createContext({});

export const useAppNetwork = () => useContext(NetworkContext);

const { chains, provider } = configureChains(
  [chain.mainnet, chain.arbitrum, chain.goerli],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ID }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [metaMaskWallet({ chains }), walletConnectWallet({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function Network({ children }) {
  const [initialChain, setInitialChain] = useState(null);

  return (
    <NetworkContext.Provider value={{ initialChain, setInitialChain }}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          autoConnect={false}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </NetworkContext.Provider>
  );
}
