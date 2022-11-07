import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  walletConnectWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { createContext, useContext, useState } from "react";
import { chain, WagmiConfig, createClient, configureChains } from "wagmi";

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
    wallets: [
      metaMaskWallet({ chains, shimDisconnect: true }),
      walletConnectWallet({ chains }),
    ],
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
