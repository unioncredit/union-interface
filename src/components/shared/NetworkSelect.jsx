import { useNetwork, useSwitchNetwork } from "wagmi";
import { NetworkButton, NetworkSwitcher } from "@unioncredit/ui";

import { supportedNetworks, testNetworkIds, unsupportedNetwork } from "config/networks";
import { useSettings } from "providers/Settings";
import { useVersion, Versions } from "providers/Version";
import { useSupportedNetwork } from "../../hooks/useSupportedNetworks";

export function NetworkSelect() {
  const { settings } = useSettings();
  const { chain, chains } = useNetwork();
  const { setVersion } = useVersion();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { connected: isSupportedNetwork } = useSupportedNetwork();

  const networks = supportedNetworks.filter((network) =>
    settings.showTestnets ? true : !testNetworkIds.includes(network.chainId)
  );

  const handleChangeNetwork = async (value) => {
    await switchNetworkAsync(value.chainId);
    setVersion(value.version === Versions.V1 ? 1 : 2);
  };

  const networkOptions = networks
    .map((network) => ({ ...network, as: NetworkButton }))
    .filter((network) => chains.find((c) => c.id === network.chainId));

  const defaultValue = networkOptions.find((option) => option.chainId === chain?.id);

  const unsupported = {
    ...unsupportedNetwork,
    as: NetworkButton,
  };

  return (
    <NetworkSwitcher
      selected={isSupportedNetwork ? defaultValue || networkOptions[0] : unsupported}
      options={isSupportedNetwork ? networkOptions : [unsupported, ...networkOptions]}
      onChange={handleChangeNetwork}
    />
  );
}
