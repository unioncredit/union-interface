import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";
import { BlocksPerYear, WAD, ZERO } from "constants";
import { useNetwork } from "wagmi";

export default function useRewards() {
  const { chain } = useNetwork();

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

  const effectiveTotalStake = totalStaked.sub(totalFrozen);

  const estimatedDailyTotal = effectiveTotalStake.gt(ZERO)
    ? inflationPerSecond
        .mul(WAD)
        .div(effectiveTotalStake)
        .mul(stakedBalance)
        .div(WAD)
        .mul(BlocksPerYear[chain.id])
        .div(365)
    : ZERO;

  const estimatedDailyBase = rewardsMultiplier.gt(ZERO)
    ? estimatedDailyTotal.mul(WAD).div(rewardsMultiplier)
    : ZERO;
  const dailyDifference = estimatedDailyTotal.sub(estimatedDailyBase);

  return {
    unclaimed,
    estimatedDailyBase: rewardsMultiplier.gt(ZERO)
      ? estimatedDailyTotal.mul(WAD).div(rewardsMultiplier)
      : ZERO,
    estimatedDailyTotal,
    estimatedDailyBonus: dailyDifference.gt(ZERO) ? dailyDifference : ZERO,
    estimatedDailyPenalty: dailyDifference.lt(ZERO) ? dailyDifference : ZERO,
  };
}
