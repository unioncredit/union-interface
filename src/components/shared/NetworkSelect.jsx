import { useNetwork, useSwitchNetwork } from "wagmi";
import { NetworkSwitcher, NetworkButton } from "@unioncredit/ui";

import {
  testNetworkIds,
  parseNetworksVersions,
  networks as allNetworks,
} from "config/networks";
import { useSettings } from "providers/Settings";
import { useVersion, Versions } from "providers/Version";

export function NetworkSelect() {
  const { settings } = useSettings();
  const { chain, chains } = useNetwork();
  const { setVersion } = useVersion();
  const { switchNetworkAsync } = useSwitchNetwork();

  const networks = parseNetworksVersions(allNetworks).filter((network) =>
    settings.showTestnets ? true : !testNetworkIds.includes(network.chainId)
  );

  const handleChangeNetwork = async (value) => {
    await switchNetworkAsync(value.chainId);
    setVersion(value.version === Versions.V1 ? 1 : 2);
  };

  const networkOptions = networks
    .map((network) => ({ ...network, as: NetworkButton }))
    .filter((network) => chains.find((c) => c.id === network.chainId));

  const defaultValue = networkOptions.find(
    (option) => option.chainId === chain?.id
  );

  return (
    <NetworkSwitcher
      selected={defaultValue || networkOptions[0]}
      options={networkOptions}
      onChange={handleChangeNetwork}
    />
  );
}
