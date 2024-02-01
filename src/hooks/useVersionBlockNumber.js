import { useBlockNumber } from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";

export function useVersionBlockNumber({ chainId }) {
  const { data: blockNumber } = useBlockNumber({
    chainId: chainId === arbitrum.id ? mainnet.id : chainId,
  });

  return {
    data: blockNumber,
  };
}
