import { useVersion, Versions } from "providers/Version";
import { networks as allNetworks } from "config/networks";

export default function useNetworks() {
  const { version } = useVersion();
  return allNetworks[version || Versions.V1];
}
