import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";

import { truncateAddress } from "utils/truncateAddress";
import useLabels from "hooks/useLabels";

export function PrimaryLabel({ address }) {
  const { data } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const { getLabel } = useLabels();

  return getLabel(address) || data || truncateAddress(address);
}
