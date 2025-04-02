import { useAccount } from "wagmi";

import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";
import { PaymentUnitsPerYear, TOKENS, WAD, ZERO } from "constants";
import { useToken } from "hooks/useToken";

export default function useRewards() {
  const { chain } = useAccount();
  const { wad } = useToken();

  const { data: member } = useMember();
  const { data: protocol } = useProtocol();

  const {
    rewardsMultiplier,
    unclaimedRewards: unclaimed = ZERO,
    stakedBalance = ZERO,
    totalStaked = ZERO,
    totalFrozen = ZERO,
    inflationPerSecond = ZERO,
  } = { ...protocol, ...member };

  const effectiveTotalStake = totalStaked - totalFrozen;

  const estimatedDailyTotal =
    effectiveTotalStake > ZERO
      ? (((((inflationPerSecond * wad) / effectiveTotalStake) * stakedBalance) / wad) *
          PaymentUnitsPerYear[chain.id]) /
        365n
      : ZERO;

  const estimatedDailyBase =
    rewardsMultiplier > ZERO ? (estimatedDailyTotal * WAD[TOKENS.UNION]) / rewardsMultiplier : ZERO;
  const dailyDifference = estimatedDailyTotal - estimatedDailyBase;

  return {
    unclaimed,
    estimatedDailyBase:
      rewardsMultiplier > ZERO
        ? (estimatedDailyTotal * WAD[TOKENS.UNION]) / rewardsMultiplier
        : ZERO,
    estimatedDailyTotal,
    estimatedDailyBonus: dailyDifference > ZERO ? dailyDifference : ZERO,
    estimatedDailyPenalty: dailyDifference < ZERO ? dailyDifference : ZERO,
  };
}
