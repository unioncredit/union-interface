import { useNetwork } from "wagmi";

import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";
import { PaymentUnitsPerYear, TOKENS, WAD, ZERO } from "constants";
import { useToken } from "hooks/useToken";

export default function useRewards() {
  const { chain } = useNetwork();
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

  const effectiveTotalStake = totalStaked.sub(totalFrozen);

  const estimatedDailyTotal = effectiveTotalStake.gt(ZERO)
    ? inflationPerSecond
        .mul(wad)
        .div(effectiveTotalStake)
        .mul(stakedBalance)
        .div(wad)
        .mul(PaymentUnitsPerYear[chain.id])
        .div(365)
    : ZERO;

  const estimatedDailyBase = rewardsMultiplier.gt(ZERO)
    ? estimatedDailyTotal.mul(WAD[TOKENS.UNION]).div(rewardsMultiplier)
    : ZERO;
  const dailyDifference = estimatedDailyTotal.sub(estimatedDailyBase);

  return {
    unclaimed,
    estimatedDailyBase: rewardsMultiplier.gt(ZERO)
      ? estimatedDailyTotal.mul(WAD[TOKENS.UNION]).div(rewardsMultiplier)
      : ZERO,
    estimatedDailyTotal,
    estimatedDailyBonus: dailyDifference.gt(ZERO) ? dailyDifference : ZERO,
    estimatedDailyPenalty: dailyDifference.lt(ZERO) ? dailyDifference : ZERO,
  };
}
