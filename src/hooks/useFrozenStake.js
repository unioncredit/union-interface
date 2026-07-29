import { useMemo } from "react";

import { ZERO } from "constants";
import { reduceBnSum } from "utils/reduce";
import { useVouchees } from "providers/VoucheesData";

/**
 * The connected member's staker-side delinquency exposure: which contacts they
 * back are overdue, and how much of their own stake those contacts have frozen.
 *
 * Shared by StakeStats and FrozenStakeAlert so the two can't drift — the alert
 * is what a member sees before they ever open the Stake tab.
 */
export function useFrozenStake() {
  const { data: vouchees = [] } = useVouchees();

  return useMemo(() => {
    const overdueVouchees = vouchees.filter((v) => v.isOverdue);
    const frozen = overdueVouchees.map((v) => v.locking ?? ZERO).reduce(reduceBnSum, ZERO);

    return {
      overdueVouchees,
      count: overdueVouchees.length,
      frozen,
      // Only worth interrupting someone when real capital is affected: a
      // contact can read as overdue while locking nothing (nothing borrowed
      // against this member's vouch), which is not the member's problem.
      hasFrozenStake: overdueVouchees.length > 0 && frozen > ZERO,
    };
  }, [vouchees]);
}
