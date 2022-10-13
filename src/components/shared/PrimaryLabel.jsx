import { useEnsName } from "wagmi";

import { truncateAddress } from "utils/truncateAddress";

export default function PrimaryLabel({ address }) {
  const { data } = useEnsName({
    address,
  });

  return data || truncateAddress(address);
}
