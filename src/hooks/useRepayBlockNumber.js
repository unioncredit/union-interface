import { chain, useBlockNumber } from "wagmi";

export default function useRepayBlockNumber({ chainId }) {
  return useBlockNumber({
    chainId: chainId === chain.arbitrum.id ? chain.mainnet.id : chainId,
  });
}
