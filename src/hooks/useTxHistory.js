import { mainnet, useNetwork, useContractEvent } from "wagmi";
import { ZERO_ADDRESS } from "constants";
import { useEffect, useState } from "react";
import useContract from "hooks/useContract";
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
  const uTokenManager = useContract("uToken", chain?.id ?? mainnet.id);

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

  useContractEvent({
    ...uTokenManager,
    eventName: "LogBorrow",
    listener: (account, to, amount, fee) => {
      console.debug("Listener: LogBorrow received", { account, to, amount, fee });
      loadData();
    },
  });

  useContractEvent({
    ...uTokenManager,
    eventName: "LogRepay",
    listener: (payer, borrower, sendAmount) => {
      console.debug("Listener: LogRepay received", { payer, borrower, sendAmount });
      loadData();
    },
  });

  useEffect(() => {
    staker !== ZERO_ADDRESS && loadData();
  }, [version, chain.id, borrower, staker, cached, cacheKey, cache]);

  return { data, loading };
}
