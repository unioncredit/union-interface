import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useProvider } from "wagmi";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ZERO } from "constants";
import { getVersion, Versions } from "providers/Version";

dayjs.extend(relativeTime);

export function useBlockTime(blockNumber, chainId, dateFormat = "dd LLL yyyy") {
  const [timestamp, setTimestamp] = useState(null);
  const provider = useProvider({
    chainId: chainId,
  });

  useEffect(() => {
    const load = async () => {
      if (blockNumber && !blockNumber.eq(ZERO)) {
        const blockNum = Number(blockNumber.toString());

        if (getVersion(chainId) === Versions.V2) {
          setTimestamp(blockNum * 1000);
        } else {
          const block = await provider.getBlock(blockNum);
          setTimestamp(block.timestamp * 1000);
        }
      }
    };
    provider && load();
  }, [provider, blockNumber, chainId]);

  return {
    timestamp: timestamp,
    relative: timestamp ? dayjs(timestamp).fromNow() : "N/A",
    formatted: timestamp ? format(new Date(timestamp), dateFormat) : null,
  };
}
