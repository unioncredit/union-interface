import { useAccount } from "wagmi";
import { arbitrum, mainnet, optimism } from "wagmi/chains";
import { createContext, useContext, useEffect, useState } from "react";

const VersionContext = createContext({});

export const useVersion = () => useContext(VersionContext);

export const Versions = {
  V1: "v1",
  V2: "v2",
};

export const DefaultVersion = Versions.V2;

const versionSupport = {
  [Versions.V1]: [mainnet.id, arbitrum.id],
  [Versions.V2]: [optimism.id, 8453, 84532],
};

export function isVersionSupported(version, chainId) {
  return versionSupport[version]?.includes(chainId);
}

export function getVersion(chainId) {
  return isVersionSupported(Versions.V2, parseInt(chainId)) ? Versions.V2 : Versions.V1;
}

export default function Version({ children }) {
  const { isDisconnected } = useAccount();
  const { chain: connectedChain } = useAccount();
  const [version, setVersionState] = useState(null);

  const versioned = (v1, v2) => (version === Versions.V1 ? v1 : v2);

  useEffect(() => {
    if (!connectedChain?.id) return;

    const checkVersion = (_version) =>
      isVersionSupported(_version, connectedChain.id) && version !== _version;

    if (checkVersion(Versions.V2)) {
      // Priorities support for V2. If the connectted network is connected
      // to a V2 supported network then set the default version to v2
      setVersionState(Versions.V2);
    } else if (checkVersion(Versions.V1)) {
      // Otherwise fallback to V1
      setVersionState(Versions.V1);
    }
  }, [version, connectedChain?.id]);

  useEffect(() => {
    if (isDisconnected) setVersionState(null);
  }, [isDisconnected]);

  const setVersion = (v) => {
    if (v === 1) {
      setVersionState(Versions.V1);
    } else {
      setVersionState(Versions.V2);
    }
  };

  const _version = version || DefaultVersion;

  return (
    <VersionContext.Provider
      value={{
        isV2: _version === Versions.V2,
        version: _version,
        setVersion,
        versioned,
      }}
    >
      {children}
    </VersionContext.Provider>
  );
}
