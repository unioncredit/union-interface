import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useBlock } from "wagmi";
import { format } from "date-fns";
import { ZERO } from "constants";

import { getVersion, Versions } from "providers/Version";

dayjs.extend(relativeTime);

export function useBlockTime(blockNumber, chainId, dateFormat = "dd LLL yyyy") {
  const [timestamp, setTimestamp] = useState(null);
  const { data: block } = useBlock({
    chainId: chainId,
  });

  useEffect(() => {
    const load = async () => {
      if (blockNumber && blockNumber !== ZERO) {
        const blockNum = Number(blockNumber);
        if (getVersion(chainId) === Versions.V2) {
          setTimestamp(blockNum * 1000);
        } else {
          setTimestamp(Number(block.timestamp) * 1000);
        }
      }
    };
    block && load();
  }, [block, blockNumber, chainId]);

  return {
    timestamp: timestamp,
    relative: timestamp ? dayjs(timestamp).fromNow() : "N/A",
    formatted: timestamp ? format(new Date(timestamp), dateFormat) : null,
  };
}
