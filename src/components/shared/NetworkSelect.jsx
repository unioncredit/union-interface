import { useAccount, useSwitchChain } from "wagmi";
import { NetworkButton, NetworkSwitcher } from "@unioncredit/ui";
import { mainnet } from "viem/chains";

import { supportedNetworks, testNetworkIds, unsupportedNetwork } from "config/networks";
import { useVersion, Versions } from "providers/Version";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";
import { rpcChains } from "constants";

export function NetworkSelect() {
  const { chain } = useAccount();
  const { setVersion } = useVersion();
  const { switchChainAsync } = useSwitchChain();
  const { connected: isSupportedNetwork } = useSupportedNetwork();
  const isMainnet = chain?.id === mainnet.id;

  const availableNetworks = supportedNetworks.filter((x) =>
    isMainnet ? true : ![mainnet.id].includes(x.chainId)
  );

  // Testnets are hidden unless the wallet is currently connected to one (the
  // Show TestNets toggle is gone; this keeps the testnet-dev workflow alive).
  const networks = availableNetworks.filter(
    (network) => !testNetworkIds.includes(network.chainId) || network.chainId === chain?.id
  );

  const handleChangeNetwork = async (value) => {
    await switchChainAsync({
      chainId: value.chainId,
    });
    setVersion(value.version === Versions.V1 ? 1 : 2);
  };

  const networkOptions = networks
    .map((network) => ({ ...network, as: NetworkButton }))
    .filter((network) => rpcChains.find((c) => c.id === network.chainId));

  const defaultValue = networkOptions.find((option) => option.chainId === chain?.id);

  const unsupported = {
    ...unsupportedNetwork,
    as: NetworkButton,
  };

  return (
    <NetworkSwitcher
      selected={isSupportedNetwork || isMainnet ? defaultValue || networkOptions[0] : unsupported}
      options={isSupportedNetwork || isMainnet ? networkOptions : [unsupported, ...networkOptions]}
      onChange={handleChangeNetwork}
    />
  );
}
