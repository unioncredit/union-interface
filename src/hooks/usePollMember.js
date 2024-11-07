import { useContractReads, useNetwork } from "wagmi";
import { useEffect, useRef } from "react";

import { CACHE_TIME, ZERO } from "constants";
import useContract from "hooks/useContract";
import { useVersion, Versions } from "providers/Version";
import { useToken } from "hooks/useToken";

export default function usePollMemberData(address, inputChainId) {
  const timer = useRef(null);
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

  useEffect(() => {
    if (!address) return;

    timer.current = setInterval(refetch, 5000);

    return () => {
      clearInterval(timer.current);
    };
  }, [address]);

  return resp;
}
