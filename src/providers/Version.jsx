import { useNetwork, chain } from "wagmi";
import { createContext, useContext, useState, useEffect } from "react";

const VersionContext = createContext({});

export const useVersion = () => useContext(VersionContext);

export const Versions = {
  V1: "v1",
  V2: "v2",
};

const versionSupport = {
  [Versions.V1]: [chain.mainnet.id, chain.goerli.id, chain.arbitrum.id],
  [Versions.V2]: [chain.goerli.id],
};

export default function Version({ children }) {
  const { chain: connectedChain } = useNetwork();
  const [version, setVersionState] = useState(null);

  useEffect(() => {
    if (version || !connectedChain) return;

    if (versionSupport[Versions.V2].includes(connectedChain.id)) {
      // Priorities support for V2. If the connectted network is connected
      // to a V2 supported network then set the default version to v2
      setVersionState(Versions.V2);
    } else {
      // Otherwise fallback to V1
      setVersionState(Versions.V1);
    }
  }, [version, connectedChain]);

  const setVersion = (v) => {
    if (v === 1) {
      setVersionState(Versions.V1);
    } else {
      setVersionState(Versions.V2);
    }
  };

  return (
    <VersionContext.Provider value={{ version, setVersion }}>
      {children}
    </VersionContext.Provider>
  );
}
