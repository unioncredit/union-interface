import { useAccount, useWatchContractEvent } from "wagmi";
import { useEffect, useState } from "react";
import { mainnet } from "viem/chains";

import { ZERO_ADDRESS } from "constants";
import { compareAddresses } from "utils/compare";
import useContract from "hooks/useContract";
import { useCache } from "providers/Cache";
import { useVersion } from "providers/Version";
import fetchUserTransactions from "fetchers/fetchUserTransactions";
import fetchUTokenTransactions from "fetchers/fetchUTokenTransactions";
import fetchRegisterTransactions from "fetchers/fetchRegisterTransactions";

export default function useTxHistory({ staker = ZERO_ADDRESS, borrower = ZERO_ADDRESS }) {
  const { chain } = useAccount();
  const { version } = useVersion();
  const { cache, cached } = useCache();

  const cacheKey = `useTxHistory__${staker}___${borrower}__${chain?.network}`;

  const [data, setData] = useState(cached(cacheKey) || []);
  const [loading, setLoading] = useState(true);
  const uTokenManager = useContract("uToken", chain?.id ?? mainnet.id);

  // `force` bypasses the cache read. An event-driven refresh must skip it —
  // otherwise a new borrow/repay would re-serve the cached (pre-event) history and
  // the refresh would be a no-op.
  async function loadData(force = false) {
    if (!force && cached(cacheKey)) {
      setData(cached(cacheKey));
      setLoading(false);
      return;
    }

    if (!chain?.id) {
      setLoading(false);
      return;
    }

    setData([]);
    const registerTransactions = await fetchRegisterTransactions(version, chain?.id, staker);
    const utokenTransactions = await fetchUTokenTransactions(version, chain?.id, staker);
    const userTransactions = await fetchUserTransactions(version, chain?.id, staker);

    const txHistory = [...registerTransactions, ...utokenTransactions, ...userTransactions].sort(
      (a, b) => Number(b.timestamp) - Number(a.timestamp)
    );

    cache(cacheKey, txHistory);
    setData(txHistory);
    setLoading(false);
  }

  // wagmi v2 takes `onLogs` and passes an array of logs with decoded named args.
  // The previous `listener` prop (the v1 positional shape) was silently ignored,
  // so a new borrow or repay never refreshed the history.
  //
  // Arg names match the uToken ABI: LogBorrow(account, to, amount, fee) and
  // LogRepay(payer, account, amount).
  const involvesAddresses = (logs, keys) =>
    (logs || []).some((log) =>
      keys.some(
        (key) =>
          compareAddresses(log?.args?.[key], staker) ||
          compareAddresses(log?.args?.[key], borrower)
      )
    );

  useWatchContractEvent({
    ...uTokenManager,
    eventName: "LogBorrow",
    onLogs: (logs) => {
      if (involvesAddresses(logs, ["account", "to"])) loadData(true);
    },
  });

  useWatchContractEvent({
    ...uTokenManager,
    eventName: "LogRepay",
    onLogs: (logs) => {
      if (involvesAddresses(logs, ["payer", "account"])) loadData(true);
    },
  });

  useEffect(() => {
    staker !== ZERO_ADDRESS && loadData();
  }, [version, chain?.id, borrower, staker, cached, cacheKey, cache]);

  return { data, loading };
}
