import { useVersion, Versions } from "providers/Version";
import { networks as allNetworks } from "config/networks";

export default function useNetworks(all = false) {
  const { version } = useVersion();
  if (all) {
    return [...allNetworks[Versions.V1], ...allNetworks[Versions.V2]];
  }
  return allNetworks[version || Versions.V1];
}
