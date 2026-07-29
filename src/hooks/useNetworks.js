import { useVersion, Versions } from "providers/Version";
import { networks as allNetworks } from "config/networks";
import { useMemo } from "react";

export default function useNetworks(all = false, forceVersion = null) {
  const { version } = useVersion();
  // Both branches share one unconditional useMemo: calling a hook inside
  // `if (all)` changed the hook order whenever `all` changed, which React
  // forbids (and would throw once any caller passed a dynamic value).
  return useMemo(
    () =>
      all
        ? [...allNetworks[Versions.V1], ...allNetworks[Versions.V2]]
        : allNetworks[forceVersion ?? version],
    [all, forceVersion, version]
  );
}
