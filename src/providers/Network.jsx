import { chain, WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

import { createContext, useContext, useState } from "react";

const NetworkContext = createContext({});

export const useAppNetwork = () => useContext(NetworkContext);

const alchemyId = process.env.REACT_APP_ALCHEMY_ID;

const chains = [chain.mainnet, chain.arbitrum, chain.goerli];

const wagmiClient = createClient(
  getDefaultClient({
    appName: "Union Credit",
    alchemyId,
    chains,
  })
);

export default function Network({ children }) {
  const [initialChain, setInitialChain] = useState(chain.goerli.id);

  return (
    <NetworkContext.Provider value={{ initialChain, setInitialChain }}>
      <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider initialChainId={initialChain}>
          {children}
        </ConnectKitProvider>
      </WagmiConfig>
    </NetworkContext.Provider>
  );
}
