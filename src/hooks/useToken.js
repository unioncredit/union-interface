import { useAccount } from "wagmi";
import { arbitrum, mainnet, optimism } from "wagmi/chains";

import { TOKENS, UNIT, WAD } from "constants";
import { base } from "viem/chains";

export const useToken = (chainId) => {
  const { chain: connectedChain } = useAccount();

  const tokens = {
    [mainnet.id]: TOKENS.DAI,
    [optimism.id]: TOKENS.DAI,
    // Union v1. Arbitrum is a configured wagmi chain, so a wallet connected there reaches
    // the data providers, which crash on a null token (#401).
    [arbitrum.id]: TOKENS.DAI,
    [base.id]: TOKENS.USDC, // base
  };

  const id = chainId || connectedChain?.id || base.id;
  const token = tokens[id] || null;

  return {
    token,
    unit: UNIT[token] || null,
    wad: WAD[token] || null,
  };
};
