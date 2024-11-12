import { useEffect, useState } from "react";
import { optimism } from "wagmi/chains";
import { isAddress } from "ethers/lib/utils";
import { BigNumber } from "ethers";

import fetchReferrals from "fetchers/fetchReferrals";
import { getVersion } from "providers/Version";
import { ZERO } from "constants";
import { useCache } from "providers/Cache";
import { base } from "providers/Network";

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
    const ethEarned = referrals.reduce((acc, curr) => acc.add(BigNumber.from(curr.rebate)), ZERO);

    cache(cacheKey, ethEarned);
    setData(ethEarned);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [address]);

  return { data, loading };
};
