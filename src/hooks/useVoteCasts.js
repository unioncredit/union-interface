import { chain, useNetwork } from "wagmi";
import { useEffect, useState } from "react";

import { useCache } from "providers/Cache";
import fetchVoteCasts from "fetchers/fetchVoteCasts";

export default function useVoteCasts() {
  const { chain: connectedChain } = useNetwork();
  const { cache, cached } = useCache();
  const [data, setData] = useState([]);

  const cacheKey = "useVoters";

  useEffect(() => {
    async function loadData() {
      setData([]);

      if (cached(cacheKey)) {
        setData(cached(cacheKey));
        return;
      }

      const voteCasts = await fetchVoteCasts(connectedChain.id);

      cache(cacheKey, voteCasts);
      setData(voteCasts);
    }

    connectedChain.id === chain.mainnet.id && loadData();
  }, [connectedChain.id]);

  return { data };
}
