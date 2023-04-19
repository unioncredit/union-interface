import { useBlockNumber } from "wagmi";
import { mainnet, arbitrum } from "wagmi/chains";

export default function useRepayBlockNumber({ chainId }) {
  return useBlockNumber({
    chainId: chainId === arbitrum.id ? mainnet.id : chainId,
  });
}
