import { useNetwork, useSwitchNetwork } from "wagmi";
import { NetworkSwitcher, NetworkButton } from "@unioncredit/ui";

import { networks } from "config/networks";

export default function NetworkSelect() {
  const { chain, chains } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const defaultValue = networks.find((option) => option.chainId === chain?.id);

  const handleChangeNetwork = async (value, setSelected) => {
    try {
      await switchNetworkAsync(value.chainId);
    } catch (_) {
      setSelected(networks.find((option) => option.chainId === chain?.id));
    }
  };

  const networkOptions = networks
    .map((network) => ({ ...network, as: NetworkButton }))
    .filter((network) => chains.find((c) => c.id === network.chainId));

  return (
    <NetworkSwitcher
      selected={defaultValue || networkOptions[0]}
      options={networkOptions}
      onChange={handleChangeNetwork}
    />
  );
}
