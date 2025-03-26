import { useContractReads, useNetwork } from "wagmi";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

import { CACHE_TIME, ZERO } from "constants";
import useContract from "hooks/useContract";
import { useVersion, Versions } from "providers/Version";
import { useToken } from "hooks/useToken";

const INITIAL_POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_INTERVAL = 30000; // 30 seconds
const BACKOFF_FACTOR = 1.5;
const MIN_CHANGE_THRESHOLD = 0.01; // Minimum change threshold to consider data significant

// Debounce utility with cleanup
const createDebounce = () => {
  let timeout;
  return {
    debounce: (func, wait) => {
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    cleanup: () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  };
};

export default function usePollMemberData(address, inputChainId) {
  const refs = useRef({
    timer: null,
    observer: null,
    isPolling: false,
    isMounted: true,
    lastData: null,
    elementId: `poll-member-${Math.random().toString(36).substr(2, 9)}`,
  });
  const [pollInterval, setPollInterval] = useState(INITIAL_POLL_INTERVAL);
  const [isVisible, setIsVisible] = useState(false);
  const [isWindowActive, setIsWindowActive] = useState(true);
  const { chain: connectedChain } = useNetwork();
  const { version } = useVersion();
  const { token } = useToken(inputChainId);

  const versioned = useCallback(
    (v1, v2) => (version === Versions.V1 ? v1 : v2),
    [version]
  );

  const chainId = inputChainId || connectedChain?.id;
  const tokenContract = useContract(token.toLowerCase(), chainId);
  const uTokenContract = useContract("uToken", chainId);
  const comptrollerContract = useContract("comptroller", chainId);

  const contracts = useMemo(() => {
    if (!address) return [];
    
    return [
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
    ];
  }, [address, comptrollerContract, uTokenContract, tokenContract, version, versioned]);

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

  // Check if data has changed significantly
  const hasSignificantChange = useCallback((newData) => {
    if (!refs.current.lastData) return true;
    
    return (
      Math.abs(newData.unclaimedRewards - refs.current.lastData.unclaimedRewards) > MIN_CHANGE_THRESHOLD ||
      Math.abs(newData.owed - refs.current.lastData.owed) > MIN_CHANGE_THRESHOLD ||
      Math.abs(newData.interest - refs.current.lastData.interest) > MIN_CHANGE_THRESHOLD
    );
  }, []);

  // Create debounce instance
  const debounceInstance = useMemo(() => createDebounce(), []);

  // Debounced setInterval to prevent rapid state updates
  const debouncedSetInterval = useCallback(
    debounceInstance.debounce((value) => {
      if (refs.current.isMounted) {
        setPollInterval(value);
      }
    }, 100),
    [debounceInstance]
  );

  // Set up window visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!refs.current.isMounted) return;
      setIsWindowActive(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Set up intersection observer
  useEffect(() => {
    if (!address) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!refs.current.isMounted) return;
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          debouncedSetInterval(INITIAL_POLL_INTERVAL);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    refs.current.observer = observer;
    const element = document.getElementById(refs.current.elementId);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (refs.current.observer) {
        refs.current.observer.disconnect();
        refs.current.observer = null;
      }
    };
  }, [address, debouncedSetInterval]);

  // Set up polling
  useEffect(() => {
    if (!address || !isVisible || !isWindowActive) return;

    const poll = async () => {
      if (refs.current.isPolling || !refs.current.isMounted) return;
      
      try {
        refs.current.isPolling = true;
        const result = await refetch();
        
        if (!refs.current.isMounted) return;
        
        if (hasSignificantChange(result.data)) {
          if (refs.current.isMounted) {
            setPollInterval(INITIAL_POLL_INTERVAL);
          }
          refs.current.lastData = result.data;
        } else {
          if (refs.current.isMounted) {
            setPollInterval((prev) => {
              const newInterval = Math.min(prev * BACKOFF_FACTOR, MAX_POLL_INTERVAL);
              return newInterval;
            });
          }
        }
      } catch (error) {
        console.error('Error polling member data:', error);
        if (refs.current.isMounted) {
          setPollInterval(INITIAL_POLL_INTERVAL);
          // Clear timer on error to prevent rapid retries
          if (refs.current.timer) {
            clearInterval(refs.current.timer);
            refs.current.timer = null;
          }
        }
      } finally {
        refs.current.isPolling = false;
      }
    };

    poll();
    refs.current.timer = setInterval(poll, pollInterval);

    return () => {
      if (refs.current.timer) {
        clearInterval(refs.current.timer);
        refs.current.timer = null;
      }
    };
  }, [address, refetch, isVisible, isWindowActive, hasSignificantChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      refs.current.isMounted = false;
      if (refs.current.timer) {
        clearInterval(refs.current.timer);
        refs.current.timer = null;
      }
      if (refs.current.observer) {
        refs.current.observer.disconnect();
        refs.current.observer = null;
      }
      debounceInstance.cleanup();
    };
  }, [debounceInstance]);

  return {
    ...resp,
    ref: { current: document.getElementById(refs.current.elementId) },
    elementId: refs.current.elementId,
  };
}
