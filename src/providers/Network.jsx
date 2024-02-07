import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { createContext, useContext } from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, goerli, mainnet, optimism, optimismGoerli } from "wagmi/chains";

// eslint-disable-next-line no-undef
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

const NetworkContext = createContext({});

export const useAppNetwork = () => useContext(NetworkContext);

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, arbitrum, goerli, optimismGoerli, optimism],
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
  return (
    <WagmiConfig client={wagmiClient} persister={null}>
      <RainbowKitProvider
        chains={chains}
        autoConnect={true}
        modalSize="compact"
        initialChain={optimism.id}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
