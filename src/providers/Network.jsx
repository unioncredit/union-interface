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

// Public fallback RPCs used when the primary (Alchemy) endpoint fails — e.g.
// when the Alchemy app's monthly capacity is exhausted (observed in production:
// every network 429s with "Monthly capacity limit exceeded"), or a network is
// missing from the Alchemy app. Every configured chain needs an entry here:
// Optimism had none, so exhausted Alchemy quota blanked all Optimism data while
// Base and mainnet kept working through their fallbacks. All endpoints below are
// CORS-open (verified) and only serve tip reads in the browser, so full-history
// capability is not required.
const FALLBACK_RPCS = {
  [base.id]: "https://base-rpc.publicnode.com",
  [mainnet.id]: "https://ethereum-rpc.publicnode.com",
  [optimism.id]: "https://mainnet.optimism.io",
  [arbitrum.id]: "https://arb1.arbitrum.io/rpc",
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
