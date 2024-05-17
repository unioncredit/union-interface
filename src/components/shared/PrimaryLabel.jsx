import { useEnsName, useNetwork } from "wagmi";
import { mainnet, optimismGoerli } from "wagmi/chains";

import { truncateAddress, truncateEns } from "utils/truncateAddress";
import useLabels from "hooks/useLabels";
import { vouchFaucetContract } from "config/contracts/v2/optimismGoerli";
import { AddressEnsMappings } from "../../constants";

export function PrimaryLabel({ address, shouldTruncate = true }) {
  const { chain } = useNetwork();
  const { data } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const ens = AddressEnsMappings[address.toLowerCase()] || data;

  const { getLabel } = useLabels();

  if (chain?.id === optimismGoerli.id && address === vouchFaucetContract.address) {
    return "Testnet Vouch Faucet";
  }

  return (
    getLabel(address) ||
    (ens && (shouldTruncate ? truncateEns(ens) : ens)) ||
    (shouldTruncate ? truncateAddress(address) : address)
  );
}
