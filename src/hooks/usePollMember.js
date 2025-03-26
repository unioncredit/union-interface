import { useContractReads, useNetwork } from "wagmi";
import { useEffect, useRef, useState } from "react";

import { CACHE_TIME, ZERO } from "constants";
import useContract from "hooks/useContract";
import { useVersion, Versions } from "providers/Version";
import { useToken } from "hooks/useToken";

const INITIAL_POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_INTERVAL = 30000; // 30 seconds
const BACKOFF_FACTOR = 1.5;

export default function usePollMemberData(address, inputChainId) {
  const timer = useRef(null);
  const [pollInterval, setPollInterval] = useState(INITIAL_POLL_INTERVAL);
  const [isWindowActive, setIsWindowActive] = useState(true);
  const { chain: connectedChain } = useNetwork();
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

  const resp = useContractReads({
    enabled: false,
    select: (data) => {
      return {
        unclaimedRewards: data[0] || ZERO,
        owed: data[1] || ZERO,
        interest: data[2] || ZERO,
      };
    },
    contracts: contracts.map((contract) => ({
      ...contract,
      chainId,
    })),
    cacheTime: CACHE_TIME,
  });

  const { refetch } = resp;

  // Set up window visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsWindowActive(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Set up polling with backoff
  useEffect(() => {
    if (!address || !isWindowActive) return;

    const poll = async () => {
      try {
        const result = await refetch();
        // If data hasn't changed significantly, increase the interval
        setPollInterval(prev => Math.min(prev * BACKOFF_FACTOR, MAX_POLL_INTERVAL));
      } catch (error) {
        console.error('Error polling member data:', error);
        // Reset interval on error
        setPollInterval(INITIAL_POLL_INTERVAL);
      }
    };

    poll();
    timer.current = setInterval(poll, pollInterval);

    return () => {
      clearInterval(timer.current);
    };
  }, [address, isWindowActive, refetch]);

  return resp;
}
