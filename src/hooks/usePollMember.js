import { useAccount, useReadContracts } from "wagmi";
import { useEffect, useRef, useState } from "react";

import { ZERO } from "constants";
import useContract from "hooks/useContract";
import { useVersion, Versions } from "providers/Version";
import { useToken } from "hooks/useToken";

const INITIAL_POLL_INTERVAL = 2000; // 2 seconds
const MAX_POLL_INTERVAL = 60000; // 60 seconds
const BACKOFF_FACTOR = 1.5;

export default function usePollMemberData(address, inputChainId) {
  const timer = useRef(null);
  const intervalRef = useRef(INITIAL_POLL_INTERVAL);
  const [isWindowActive, setIsWindowActive] = useState(true);
  const { chain: connectedChain } = useAccount();
  const { version } = useVersion();
  const { token } = useToken(inputChainId);

  const versioned = (v1, v2) => (version === Versions.V1 ? v1 : v2);

  const chainId = inputChainId || connectedChain?.id;
  const tokenContract = useContract(token.toLowerCase(), chainId);
  const uTokenContract = useContract("uToken", chainId);
  const comptrollerContract = useContract("comptroller", chainId);

  const contracts = address
    ? [
        {
          ...comptrollerContract,
          functionName: versioned("calculateRewardsByBlocks", "calculateRewards"),
          args:
            version === Versions.V1
              ? [address, tokenContract.address, ZERO]
              : [address, tokenContract.address],
        },
        {
          ...uTokenContract,
          functionName: "borrowBalanceView",
          args: [address],
        },
        {
          ...uTokenContract,
          functionName: "calculatingInterest",
          args: [address],
        },
      ]
    : [];

  const resp = useReadContracts({
    contracts: contracts.map((contract) => ({
      ...contract,
      chainId,
    })),
    query: {
      enabled: false,
      select: (data) => {
        return {
          unclaimedRewards: data[0].result || ZERO,
          owed: data[1].result || ZERO,
          interest: data[2].result || ZERO,
        };
      },
    },
  });

  const { refetch } = resp;

  // Set up window visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsWindowActive(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Set up polling with backoff.
  //
  // The interval lives in a ref and each run self-schedules the next one. It used
  // to live in state AND in this effect's dependency list, while every poll() call
  // bumped it — so each poll re-ran the effect, which immediately polled again,
  // firing ~10 back-to-back multicalls per mount (2s -> 60s) and another burst on
  // every error reset.
  useEffect(() => {
    if (!address || !isWindowActive) return;

    let cancelled = false;
    intervalRef.current = INITIAL_POLL_INTERVAL;

    const scheduleNext = () => {
      if (cancelled) return;
      timer.current = setTimeout(poll, intervalRef.current);
    };

    const poll = async () => {
      if (cancelled) return;

      try {
        await refetch();
        // Back off while the app is idle, up to MAX_POLL_INTERVAL.
        intervalRef.current = Math.min(intervalRef.current * BACKOFF_FACTOR, MAX_POLL_INTERVAL);
      } catch (error) {
        console.error("Error polling member data:", error);
        intervalRef.current = INITIAL_POLL_INTERVAL;
      }

      scheduleNext();
    };

    // Poll once immediately, then let each run schedule the next.
    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer.current);
    };
  }, [address, isWindowActive, refetch]);

  return resp;
}
