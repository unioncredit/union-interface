import {
  mainnet,
  goerli,
  arbitrum,
  optimismGoerli,
  optimism,
} from "wagmi/chains";

const urls = {
  [mainnet.id]: "https://etherscan.io",
  [goerli.id]: "https://goerli.etherscan.io",
  [arbitrum.id]: "https://arbiscan.io",
  [optimismGoerli.id]: "https://goerli-optimism.etherscan.io",
  [optimism.id]: "https://optimism.etherscan.io",
};

export function blockExplorerTx(chainId, hash) {
  return `${urls[chainId]}/tx/${hash}`;
}

export function blockExplorerAddress(chainId, address) {
  return `${urls[chainId]}/address/${address}`;
}
