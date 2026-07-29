import { useAccount } from "wagmi";
import { supportedNetworks, testNetworkIds } from "../config/networks";
import { mainnet } from "wagmi/chains";

export function useSupportedNetwork() {
  const { chain } = useAccount();

  // Ethereum mainnet is marked as supported network because we need to access it for governance
  // but we filter it out because we don't want users to be able to access the credit portion of the
  // app on mainnet.
  const isSupported = (chainId) =>
    chainId && supportedNetworks.some((n) => n.chainId === chainId) && chainId !== mainnet.id;

  return {
    connected: isSupported(chain?.id),
    supportedNetworks: supportedNetworks
      .filter((n) => isSupported(n.chainId))
      // Testnets are hidden unless the wallet is currently connected to one
      // (the Show TestNets toggle is gone; this keeps testnet devs unblocked).
      .filter((n) => !testNetworkIds.includes(n.chainId) || n.chainId === chain?.id),
    isSupported,
  };
}
