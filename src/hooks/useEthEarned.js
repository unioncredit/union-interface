import { useEffect, useState } from "react";
import { base, optimism } from "viem/chains";
import { isAddress } from "viem";

import fetchReferrals from "fetchers/fetchReferrals";
import { getVersion } from "providers/Version";
import { useCache } from "providers/Cache";
import { ZERO } from "constants";

export const useEthEarned = (address) => {
  const [data, setData] = useState(ZERO);
  const [loading, setLoading] = useState(false);

  const cacheKey = `useEthEarned__${address}`;
  const { cache, cached } = useCache();

  async function loadData() {
    setData(ZERO);

    if (!address || !isAddress(address)) {
      return;
    }

    if (cached(cacheKey)) {
      setData(cached(cacheKey));
      setLoading(false);
      return;
    }

    const optimismReferrals = await fetchReferrals(getVersion(optimism.id), optimism.id, address);
    const baseReferrals = await fetchReferrals(getVersion(base.id), base.id, address);

    const referrals = [...optimismReferrals, ...baseReferrals];
    const ethEarned = referrals.reduce((acc, curr) => acc + BigInt(curr.rebate), ZERO);

    cache(cacheKey, ethEarned);
    setData(ethEarned);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [address]);

  return { data, loading };
};
