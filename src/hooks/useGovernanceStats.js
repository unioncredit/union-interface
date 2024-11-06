import { useContractReads } from "wagmi";
import useContract from "hooks/useContract";
import { CACHE_TIME, STALE_TIME, ZERO } from "constants";
import { arbitrum, mainnet, optimism } from "wagmi/chains";
import { Versions } from "providers/Version";

export function useGovernanceStats({ address }) {
  const mainnetDai = useContract("dai", mainnet.id, Versions.V1);
  const mainnetUnion = useContract("union", mainnet.id, Versions.V1);
  const mainnetComptroller = useContract("comptroller", mainnet.id, Versions.V1);

  const arbitrumUnion = useContract("union", arbitrum.id, Versions.V1);
  const optimismUnion = useContract("union", optimism.id, Versions.V2);

  return useContractReads({
    select: (data) => {
      const [
        mainnetVotes = ZERO,
        mainnetBalance = ZERO,
        mainnetUnclaimed = ZERO,
        arbitrumBalance = ZERO,
        optimismBalance = ZERO,
      ] = data || [];

      return {
        mainnetVotes,
        mainnetBalance,
        mainnetUnclaimed,
        arbitrumBalance,
        optimismBalance,
      };
    },
    contracts: address
      ? [
          {
            ...mainnetUnion,
            functionName: "getCurrentVotes",
            chainId: mainnet.id,
            args: [address],
          },
          {
            ...mainnetUnion,
            functionName: "balanceOf",
            chainId: mainnet.id,
            args: [address],
          },
          {
            ...mainnetComptroller,
            functionName: "calculateRewardsByBlocks",
            chainId: mainnet.id,
            args: [address, mainnetDai.address, ZERO],
          },
          {
            ...arbitrumUnion,
            functionName: "balanceOf",
            chainId: arbitrum.id,
            args: [address],
          },
          {
            ...optimismUnion,
            functionName: "balanceOf",
            chainId: optimism.id,
            args: [address],
          },
        ]
      : [],
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });
}
