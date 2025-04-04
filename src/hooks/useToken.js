import { useAccount } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";

import { TOKENS, UNIT, WAD } from "constants";
import { base } from "viem/chains";

export const useToken = (chainId) => {
  const { chain: connectedChain } = useAccount();

  const tokens = {
    [mainnet.id]: TOKENS.DAI,
    [optimism.id]: TOKENS.DAI,
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
