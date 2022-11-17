import { useNetwork } from "wagmi";
import { ZERO_ADDRESS } from "constants";
import { useEffect, useState } from "react";

import { useCache } from "providers/Cache";
import fetchUserTransactions from "fetchers/fetchUserTransactions";
import fetchUTokenTransactions from "fetchers/fetchUTokenTransactions";
import fetchRegisterTransactions from "fetchers/fetchRegisterTransactions";

export default function useTxHistory({
  staker = ZERO_ADDRESS,
  borrower = ZERO_ADDRESS,
}) {
  const { chain } = useNetwork();
  const { cache, cached } = useCache();
  const [data, setData] = useState([]);

  const cacheKey = `useTxHistory__${staker}___${borrower}`;

  useEffect(() => {
    async function loadData() {
      setData([]);

      if (cached(cacheKey)) {
        setData(cached(cacheKey));
        return;
      }

      const registerTransactions = await fetchRegisterTransactions(
        chain.id,
        staker
      );
      const utokenTransactions = await fetchUTokenTransactions(
        chain.id,
        staker
      );
      const userTransactions = await fetchUserTransactions(chain.id, staker);

      const txHistory = [
        ...registerTransactions,
        ...utokenTransactions,
        ...userTransactions,
      ].sort((a, b) => {
        return Number(b.timestamp) - Number(a.timestamp);
      });

      cache(cacheKey, txHistory);
      setData(txHistory);
    }

    staker !== ZERO_ADDRESS && loadData();
  }, [chain.id, borrower, staker]);

  return { data };
}
