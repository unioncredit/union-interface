import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createContext, useContext, useState } from "react";
import { base, mainnet, optimism } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { http } from "viem";

import { RPC_URL, rpcChains } from "constants";

// eslint-disable-next-line no-undef
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

const NetworkContext = createContext({});

export const useAppNetwork = () => useContext(NetworkContext);

export const config = getDefaultConfig({
  projectId,
  appName: "Union",
  chains: [base, mainnet, optimism],
  transports: rpcChains.reduce(
    (acc, network) => ({
      ...acc,
      [network.id]: http(RPC_URL(network.id), {
        batch: true,
      }),
    }),
    {}
  ),
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
