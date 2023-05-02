import { useBlockNumber } from "wagmi";
import { useVersion } from "providers/Version";
import { arbitrum, mainnet } from "wagmi/chains";

export function useVersionBlockNumber({ chainId }) {
  const { isV2 } = useVersion();
  const { data: blockNumber } = useBlockNumber({
    chainId: chainId === arbitrum.id ? mainnet.id : chainId,
  });

  const unixTimestamp = Math.round(Date.now() / 1000);

  return {
    data: isV2 ? unixTimestamp : blockNumber,
  };
}
