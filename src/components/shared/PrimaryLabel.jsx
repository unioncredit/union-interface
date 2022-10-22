import { useEnsName, chain } from "wagmi";

import { truncateAddress } from "utils/truncateAddress";

export default function PrimaryLabel({ address }) {
  const { data } = useEnsName({
    address,
    chainId: chain.mainnet.id,
  });

  return data || truncateAddress(address);
}
