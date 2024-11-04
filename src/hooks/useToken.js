import { useNetwork } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";

import { TOKENS, UNIT } from "constants";

export const useToken = (chainId) => {
  const { chain: connectedChain } = useNetwork();

  const tokens = {
    [mainnet.id]: TOKENS.DAI,
    [optimism.id]: TOKENS.DAI,
    [8453]: TOKENS.USDC, // base
  };

  const id = chainId || connectedChain?.id;
  const token = tokens[id] || null;

  return {
    token,
    unit: UNIT[token] || null,
  };
};