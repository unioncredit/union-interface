import { useNetwork } from "wagmi";
import { supportedNetworks } from "../config/networks";
import { mainnet } from "wagmi/chains";

export function useSupportedNetwork() {
  const { chain } = useNetwork();

  // Ethereum mainnet is marked as supported network because we need to access it for governance
  // but we filter it out because we don't want users to be able to access the credit portion of the
  // app on mainnet.
  const isSupported = (chainId) =>
    chainId && supportedNetworks.some((n) => n.chainId === chainId) && chainId !== mainnet.id;

  return {
    connected: isSupported(chain.id),
    isSupported,
  };
}
