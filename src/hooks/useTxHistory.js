import { useNetwork } from "wagmi";
import { ZERO_ADDRESS } from "constants";
import { useEffect, useState } from "react";

import { useCache } from "providers/Cache";
import { useVersion } from "providers/Version";
import fetchUserTransactions from "fetchers/fetchUserTransactions";
import fetchUTokenTransactions from "fetchers/fetchUTokenTransactions";
import fetchRegisterTransactions from "fetchers/fetchRegisterTransactions";

export default function useTxHistory({ staker = ZERO_ADDRESS, borrower = ZERO_ADDRESS }) {
  const cacheKey = `useTxHistory__${staker}___${borrower}`;

  const { chain } = useNetwork();
  const { version } = useVersion();
  const { cache, cached } = useCache();
  const [data, setData] = useState(cached(cacheKey) || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (cached(cacheKey)) {
        setData(cached(cacheKey));
        setLoading(false);
        return;
      }

      setData([]);
      const registerTransactions = await fetchRegisterTransactions(version, chain.id, staker);
      const utokenTransactions = await fetchUTokenTransactions(version, chain.id, staker);
      const userTransactions = await fetchUserTransactions(version, chain.id, staker);

      const txHistory = [...registerTransactions, ...utokenTransactions, ...userTransactions].sort(
        (a, b) => Number(b.timestamp) - Number(a.timestamp)
      );

      cache(cacheKey, txHistory);
      setData(txHistory);
      setLoading(false);
    }

    staker !== ZERO_ADDRESS && loadData();
  }, [version, chain.id, borrower, staker, cached, cacheKey, cache]);

  return { data, loading };
}
