const urls = {
  1: "https://etherscan.io",
  5: "https://goerli.etherscan.io",
  420: "https://goerli.optimism.io",
  42161: "https://arbiscan.io",
};

export function blockExplorerTx(chainId, hash) {
  return `${urls[chainId]}/tx/${hash}`;
}

export function blockExplorerAddress(chainId, address) {
  return `${urls[chainId]}/address/${address}`;
}
