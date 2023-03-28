import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { chain, useProvider } from "wagmi";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ZERO } from "constants";

dayjs.extend(relativeTime);

export function useBlockTime(
  blockNumber,
  chainId = undefined,
  dateFormat = "dd LLL yyyy"
) {
  const [timestamp, setTimestamp] = useState(null);
  const provider = useProvider({
    // For arbitrum we use mainnet to correctly calculate repays as it uses
    // L1 block numbers.
    chainId: chainId === chain.arbitrum.id ? chain.mainnet.id : chainId,
  });

  useEffect(() => {
    const load = async () => {
      if (!blockNumber.eq(ZERO)) {
        const block = await provider.getBlock(Number(blockNumber.toString()));
        setTimestamp(block.timestamp * 1000);
      }
    };
    provider && load();
  }, [provider, blockNumber]);

  return {
    timestamp: timestamp,
    relative: timestamp ? dayjs(timestamp).fromNow() : "N/A",
    formatted: timestamp ? format(new Date(timestamp), dateFormat) : null,
  };
}
