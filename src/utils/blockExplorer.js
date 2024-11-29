import { arbitrum, mainnet, optimism } from "wagmi/chains";

import { base } from "providers/Network";

const urls = {
  [mainnet.id]: "https://etherscan.io",
  [arbitrum.id]: "https://arbiscan.io",
  [optimism.id]: "https://optimistic.etherscan.io",
  [base.id]: "https://basescan.org",
};

export function blockExplorerTx(chainId, hash) {
  return `${urls[chainId]}/tx/${hash}`;
}

export function blockExplorerAddress(chainId, address) {
  return `${urls[chainId]}/address/${address}`;
}
