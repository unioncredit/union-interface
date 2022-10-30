import { createContext } from "react";
import { WagmiConfig, createClient, chain } from "wagmi";
import { getDefaultClient } from "connectkit";

const NetworkContext = createContext({});

const client = createClient(
  getDefaultClient({
    appName: "Union Credit",
    infuraId: process.env.REACT_APP_INFURA_ID,
    chains: [chain.mainnet, chain.arbitrum, chain.goerli],
  })
);

export default function Network({ children }) {
  return (
    <NetworkContext.Provider value={{}}>
      <WagmiConfig client={client}>{children}</WagmiConfig>
    </NetworkContext.Provider>
  );
}
