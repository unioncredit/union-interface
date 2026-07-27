import { useAccount, useWatchContractEvent } from "wagmi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

    // Initial/param-change loads clear first (previous behaviour); event-driven
    // force refreshes keep the current rows on screen while fetching.
    if (!force) setData([]);

    try {
      const registerTransactions = await fetchRegisterTransactions(version, chain?.id, staker);
      const utokenTransactions = await fetchUTokenTransactions(version, chain?.id, staker);
      const userTransactions = await fetchUserTransactions(version, chain?.id, staker);

      const txHistory = [...registerTransactions, ...utokenTransactions, ...userTransactions].sort(
        (a, b) => Number(b.timestamp) - Number(a.timestamp)
      );

      cache(cacheKey, txHistory);
      setData(txHistory);
    } catch (error) {
      // The fetchers have no internal error handling and the subgraph can be
      // unavailable — a failed refresh must not destroy already-rendered history.
      console.error("Failed to load transaction history:", error);
    } finally {
      setLoading(false);
    }
  }

  // wagmi v2 takes `onLogs` and passes an array of logs with decoded named args.
  // The previous `listener` prop (the v1 positional shape) was silently ignored,
  // so a new borrow or repay never refreshed the history.
  //
  // Handler identity matters: wagmi keeps `onLogs` in its subscription effect's
  // dependency array, so a fresh handler per render would tear down and re-create
  // the watcher every render. The closure values (loadData, staker, borrower) are
  // kept fresh in a ref and the handlers are created once.
  //
  // Arg names match the uToken ABI: LogBorrow(account, to, amount, fee) and
  // LogRepay(payer, account, amount).
  const latest = useRef({ loadData, staker, borrower });
  useEffect(() => {
    latest.current = { loadData, staker, borrower };
  });

  const reloadIfInvolved = useCallback(
    (keys) => (logs) => {
      const { loadData: load, staker: s, borrower: b } = latest.current;

      const involved = (logs || []).some((log) =>
        keys.some(
          (key) => compareAddresses(log?.args?.[key], s) || compareAddresses(log?.args?.[key], b)
        )
      );

      if (involved) load(true);
    },
    []
  );

  const onBorrowLogs = useMemo(() => reloadIfInvolved(["account", "to"]), [reloadIfInvolved]);
  const onRepayLogs = useMemo(() => reloadIfInvolved(["payer", "account"]), [reloadIfInvolved]);

  useWatchContractEvent({
    ...uTokenManager,
    eventName: "LogBorrow",
    enabled: !!uTokenManager.address,
    onLogs: onBorrowLogs,
  });

  useWatchContractEvent({
    ...uTokenManager,
    eventName: "LogRepay",
    enabled: !!uTokenManager.address,
    onLogs: onRepayLogs,
  });

  useEffect(() => {
    staker !== ZERO_ADDRESS && loadData();
  }, [version, chain?.id, borrower, staker, cached, cacheKey, cache]);

  return { data, loading };
}
