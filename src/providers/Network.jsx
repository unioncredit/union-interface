import { RainbowKitProvider, connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit";
import {
  walletConnectWallet,
  metaMaskWallet,
  injectedWallet,
  coinbaseWallet,
  rainbowWallet
} from "@rainbow-me/rainbowkit/wallets";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { createContext, useContext } from "react";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, arbitrum, goerli, optimismGoerli, optimism } from "wagmi/chains";
import { useAppReadyState } from "./AppReadyState";

// eslint-disable-next-line no-undef
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

const NetworkContext = createContext({});

export const useAppNetwork = () => useContext(NetworkContext);

const { chains, provider } = configureChains(
  [mainnet, arbitrum, goerli, optimismGoerli, optimism],
  [
    // eslint-disable-next-line no-undef
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ID }),
    publicProvider()
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ projectId, chains, shimDisconnect: true }),
      walletConnectWallet({ projectId, chains, options: { projectId, showQrModal: true } }),
      coinbaseWallet({ chains }),
      rainbowWallet({ projectId, chains, shimDisconnect: true })
    ]
  }
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export default function Network({ children }) {
  const { appReady, setAppReady } = useAppReadyState();

  return (
    <NetworkContext.Provider value={{ appReady, setAppReady }}>
      <WagmiConfig client={wagmiClient} persister={null}>
        <RainbowKitProvider chains={chains} autoConnect={true} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </NetworkContext.Provider>
  );
}
