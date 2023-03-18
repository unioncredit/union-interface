import dayjs from "dayjs";
import { useProvider } from "wagmi";
import { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function BlockRelativeTime({
  block: blockNumber,
  chainId = undefined,
}) {
  const [timestamp, setTimestamp] = useState(null);
  const provider = useProvider({
    chainId: chainId,
  });

  useEffect(() => {
    async function load() {
      const block = await provider.getBlock(Number(blockNumber.toString()));
      setTimestamp(block.timestamp);
    }
    provider && load();
  }, [provider]);

  return <RelativeTime timestamp={timestamp} />;
}

export function RelativeTime({ timestamp }) {
  return timestamp ? dayjs(timestamp * 1000).fromNow() : "N/A";
}
