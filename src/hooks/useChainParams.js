import { useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";

import { supportedNetworks } from "config/networks";
import { EIP3770Map } from "constants";
import { locationSearch } from "utils/location";
import { isVersionSupported, useVersion, Versions } from "providers/Version";

export default function useChainParams() {
  const { version, setVersion } = useVersion();
  const { chain, isConnected, connector } = useAccount();
  const { switchChainAsync } = useSwitchChain({
    throwForSwitchChainNotSupported: true,
  });

  const urlSearchParams = locationSearch();

  const targetChain = urlSearchParams.has("chain")
    ? EIP3770Map[urlSearchParams.get("chain")]
    : chain?.id;

  useEffect(() => {
    (async function () {
      if (switchChainAsync && isConnected && targetChain && connector && !chain?.unsupported) {
        const toSelect = supportedNetworks.find((network) => network.chainId === targetChain);
        // If the current network is not he same as the selected network
        // fire off a chain network request. This is to support the ?chain
        // URL search param
        if (toSelect?.chainId !== chain.id) {
          try {
            await switchChainAsync(toSelect.chainId);
            if (!isVersionSupported(version, toSelect.chainId)) {
              setVersion(version === Versions.V1 ? Versions.V2 : Versions.V1);
            }
          } catch (e) {
            console.log("Network select error:", e.message);
          }
        }
      }
    })();
  }, [isConnected, connector, targetChain, supportedNetworks, switchChainAsync]);
}
