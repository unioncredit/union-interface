import { useEnsName, chain } from "wagmi";

import { truncateAddress } from "utils/truncateAddress";
import useLabels from "hooks/useLabels";

export default function PrimaryLabel({ address }) {
  const { data } = useEnsName({
    address,
    chainId: chain.mainnet.id,
  });

  const { getLabel } = useLabels();

  return getLabel(address) || data || truncateAddress(address);
}
