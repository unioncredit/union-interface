import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useProvider } from "wagmi";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ZERO } from "constants";

dayjs.extend(relativeTime);

export function useBlockTime(blockNumber, chainId, dateFormat = "dd LLL yyyy") {
  const [timestamp, setTimestamp] = useState(null);
  const provider = useProvider({
    chainId: chainId,
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
