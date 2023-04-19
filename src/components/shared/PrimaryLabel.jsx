import { useNetwork, useEnsName } from "wagmi";
import { mainnet, optimismGoerli } from "wagmi/chains";

import { truncateAddress } from "utils/truncateAddress";
import useLabels from "hooks/useLabels";
import { vouchFaucetContract } from "config/contracts/v2/optimismGoerli";

export default function PrimaryLabel({ address }) {
  const { chain } = useNetwork();
  const { data } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const { getLabel } = useLabels();

  if (
    chain?.id === optimismGoerli.id &&
    address == vouchFaucetContract.address
  ) {
    return "Testnet Vouch Faucet";
  }

  return getLabel(address) || data || truncateAddress(address);
}
