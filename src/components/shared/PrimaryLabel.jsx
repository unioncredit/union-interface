import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";

import { truncateAddress, truncateEns } from "utils/truncateAddress";
import useLabels from "hooks/useLabels";
import { AddressEnsMappings } from "../../constants";

export function PrimaryLabel({ address, shouldTruncate = true }) {
  const { data } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const ens = AddressEnsMappings[address.toLowerCase()] || data;

  const { getLabel } = useLabels();

  return (
    getLabel(address) ||
    (ens && (shouldTruncate ? truncateEns(ens) : ens)) ||
    (shouldTruncate ? truncateAddress(address) : address)
  );
}
