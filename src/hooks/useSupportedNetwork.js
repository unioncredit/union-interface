import { useAccount } from "wagmi";
import { supportedNetworks, testNetworkIds } from "../config/networks";
import { mainnet } from "wagmi/chains";
import { useSettings } from "../providers/Settings";

export function useSupportedNetwork() {
  const { chain } = useAccount();
  const { settings } = useSettings();

  // Ethereum mainnet is marked as supported network because we need to access it for governance
  // but we filter it out because we don't want users to be able to access the credit portion of the
  // app on mainnet.
  const isSupported = (chainId) =>
    chainId && supportedNetworks.some((n) => n.chainId === chainId) && chainId !== mainnet.id;

  return {
    connected: isSupported(chain?.id),
    supportedNetworks: supportedNetworks
      .filter((n) => isSupported(n.chainId))
      .filter((n) => settings.showTestnets || !testNetworkIds.includes(n.chainId)),
    isSupported,
  };
}
