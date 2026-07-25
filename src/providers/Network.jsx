import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createContext, useContext, useState } from "react";
import { base, mainnet, optimism } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { fallback, http } from "viem";

import { RPC_URL, rpcChains } from "constants";
import { arbitrum } from "wagmi/chains";

// eslint-disable-next-line no-undef
const projectId = import.meta.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

const NetworkContext = createContext({});

export const useAppNetwork = () => useContext(NetworkContext);

// Public fallback RPCs used when the primary (Alchemy) endpoint fails — notably
// keeps mainnet ENS resolution working even if the Alchemy app lacks Ethereum Mainnet.
const FALLBACK_RPCS = {
  [base.id]: "https://base-rpc.publicnode.com",
  [mainnet.id]: "https://ethereum-rpc.publicnode.com",
};

export const config = getDefaultConfig({
  projectId,
  appName: "Union",
  chains: [base, mainnet, optimism, arbitrum],
  transports: rpcChains.reduce((acc, network) => {
    const primary = http(RPC_URL(network.id), { batch: true });
    const backupUrl = FALLBACK_RPCS[network.id];

    return {
      ...acc,
      [network.id]: backupUrl
        ? fallback([primary, http(backupUrl, { batch: true })])
        : primary,
    };
  }, {}),
});

export default function Network({ children }) {
  const [forceAppReady, setForceAppReady] = useState(false);

  const queryClient = new QueryClient();

  return (
    <NetworkContext.Provider value={{ forceAppReady, setForceAppReady }}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </NetworkContext.Provider>
  );
}
