import { arbitrum, mainnet, optimism } from "wagmi/chains";

const urls = {
  [mainnet.id]: "https://etherscan.io",
  [arbitrum.id]: "https://arbiscan.io",
  [optimism.id]: "https://optimistic.etherscan.io",
};

export function blockExplorerTx(chainId, hash) {
  return `${urls[chainId]}/tx/${hash}`;
}

export function blockExplorerAddress(chainId, address) {
  return `${urls[chainId]}/address/${address}`;
}
