import { useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import { networks as supportedNetworks } from "config/networks";
import { EIP3770Map } from "constants";
import { locationSearch } from "utils/location";
import { isVersionSupported, Versions, useVersion } from "providers/Version";

export default function useChainParams() {
  const { chain } = useNetwork();
  const { version, setVersion } = useVersion();
  const { isConnected, connector } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
  });

  const urlSearchParams = locationSearch();

  const targetChain = urlSearchParams.has("chain")
    ? EIP3770Map[urlSearchParams.get("chain")]
    : chain?.id;

  useEffect(() => {
    (async function () {
      if (switchNetworkAsync && isConnected && targetChain && connector && !chain?.unsupported) {
        const toSelect = supportedNetworks.find((network) => network.chainId === targetChain);
        // If the current network is not he same as the selected network
        // fire off a chain network request. This is to support the ?chain
        // URL search param
        if (toSelect?.chainId !== chain.id) {
          try {
            await switchNetworkAsync(toSelect.chainId);
            if (!isVersionSupported(version, toSelect.chainId)) {
              setVersion(version === Versions.V1 ? Versions.V2 : Versions.V1);
            }
          } catch (e) {
            console.log("Network select error:", e.message);
          }
        }
      }
    })();
  }, [isConnected, connector, targetChain, supportedNetworks, switchNetworkAsync]);
}
