import { useNetwork, useSwitchNetwork } from "wagmi";
import { NetworkSwitcher, NetworkButton } from "@unioncredit/ui";

import { networks } from "config/networks";

export default function NetworkSelect() {
  const { chain, chains } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const defaultValue = networks.find((option) => option.chainId === chain.id);

  const handleChangeNetwork = async (value) => {
    await switchNetworkAsync(value.chainId);
  };

  const networkOptions = networks
    .map((network) => ({ ...network, as: NetworkButton }))
    .filter((network) => chains.find((c) => c.id === network.chainId));

  return (
    <NetworkSwitcher
      selected={defaultValue}
      options={networkOptions}
      onChange={handleChangeNetwork}
    />
  );
}
