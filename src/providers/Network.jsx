import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  walletConnectWallet,
  metaMaskWallet,
  injectedWallet,
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
      injectedWallet({ chains }),
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
  const [appReady, setAppReady] = useState(false);

  return (
    <NetworkContext.Provider value={{ appReady, setAppReady }}>
      <WagmiConfig client={wagmiClient} persister={null}>
        <RainbowKitProvider
          chains={chains}
          autoConnect={true}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </NetworkContext.Provider>
  );
}
