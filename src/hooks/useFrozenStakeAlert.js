import { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";

import { useFrozenStake } from "hooks/useFrozenStake";
import { DISMISSED_OVERDUE, useSettings } from "providers/Settings";

/**
 * Visibility + dismissal for FrozenStakeAlert.
 *
 * Dismissal records WHICH contacts were acknowledged rather than a "hidden"
 * flag, so the alert stays honest: dismissing it keeps it away for the
 * situation the member has seen, but a newly overdue contact makes it return.
 * A plain boolean would silence the alert permanently on the first dismissal,
 * which defeats the point of surfacing frozen capital at all.
 *
 * Kept out of useFrozenStake so StakeStats' Frozen block is never affected by
 * a dismissal — that readout should always show the full picture.
 */
export function useFrozenStakeAlert() {
  const { chain } = useAccount();
  const { settings, setSetting } = useSettings();
  const frozenStake = useFrozenStake();

  const { overdueVouchees, hasFrozenStake } = frozenStake;
  const chainId = chain?.id;

  const addresses = useMemo(
    () => overdueVouchees.map((v) => v.address?.toLowerCase()).filter(Boolean),
    [overdueVouchees]
  );

  const dismissed = useMemo(
    () => settings?.[DISMISSED_OVERDUE]?.[chainId] ?? [],
    [settings, chainId]
  );

  // Only the contacts the member has not already acknowledged keep it visible.
  const unseen = useMemo(
    () => addresses.filter((address) => !dismissed.includes(address)),
    [addresses, dismissed]
  );

  const dismiss = useCallback(() => {
    if (!chainId) return;

    setSetting(DISMISSED_OVERDUE, {
      ...(settings?.[DISMISSED_OVERDUE] ?? {}),
      [chainId]: addresses,
    });
  }, [chainId, settings, addresses, setSetting]);

  return {
    ...frozenStake,
    visible: hasFrozenStake && unseen.length > 0,
    dismiss,
  };
}
