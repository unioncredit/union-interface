import { chain } from "wagmi";
import { useEffect, useState } from "react";

import { useCache } from "providers/Cache";
import fetchVoteCasts from "fetchers/fetchVoteCasts";

export default function useVoteCasts() {
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

      const voteCasts = await fetchVoteCasts(chain.mainnet.id);

      cache(cacheKey, voteCasts);
      setData(voteCasts);
    }

    loadData();
  }, []);

  return { data };
}
