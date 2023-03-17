import { useContractReads } from "wagmi";
import { useEffect, useRef } from "react";

import { CACHE_TIME, ZERO } from "constants";
import useContract from "hooks/useContract";
import { useVersion, Versions } from "providers/Version";

export default function usePollMemberData(address, chainId) {
  const timer = useRef(null);
  const { version } = useVersion();

  const daiContract = useContract("dai", chainId);
  const uTokenContract = useContract("uToken", chainId);
  const comptrollerContract = useContract("comptroller", chainId);

  const contracts = address
    ? [
        {
          ...comptrollerContract,
          functionName:
            version === Versions.V1
              ? "calculateRewardsByBlocks"
              : "calculateRewards",
          args:
            version === Versions.V1
              ? [address, daiContract.address, ZERO]
              : [address, daiContract.address],
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
    select: (data) => ({
      unclaimedRewards: data[0] || ZERO,
      owed: data[1] || ZERO,
      interest: data[2] || ZERO,
    }),
    contracts: contracts.map((contract) => ({
      ...contract,
      chainId,
    })),
    cacheTime: CACHE_TIME,
  });

  const { refetch } = resp;

  useEffect(() => {
    if (!address) return;

    timer.current = setInterval(refetch, 5000);

    return () => {
      clearInterval(timer.current);
    };
  }, [address]);

  return resp;
}
