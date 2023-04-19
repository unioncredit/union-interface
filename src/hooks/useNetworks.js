import { useVersion, Versions } from "providers/Version";
import { networks as allNetworks } from "config/networks";
import { useMemo } from "react";

export default function useNetworks(all = false) {
  const { version } = useVersion();
  if (all) {
    return useMemo(
      () => [...allNetworks[Versions.V1], ...allNetworks[Versions.V2]],
      []
    );
  }
  return useMemo(() => allNetworks[version || Versions.V1], [version]);
}
