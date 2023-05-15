import { mainnet, useBlockNumber, useNetwork } from "wagmi";
import { useVersion } from "providers/Version";
import { arbitrum } from "wagmi/chains";

export function useVersionBlockNumber(props = {}) {
  const { chainId } = props;
  const { isV2 } = useVersion();
  const { chain } = useNetwork();
  const { data: blockNumber } = useBlockNumber({
    chainId: chain.id === arbitrum.id ? mainnet.id : chainId,
  });

  const unixTimestamp = Math.round(Date.now() / 1000);

  return {
    data: isV2 ? unixTimestamp : blockNumber,
  };
}
