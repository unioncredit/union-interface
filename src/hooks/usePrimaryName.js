import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";

import { AddressEnsMappings } from "constants";
import { truncateEns } from "utils/truncateAddress";
import { useFarcasterData } from "hooks/useFarcasterData";

export const usePrimaryName = ({ address, defaultValue = null, shouldTruncate = true }) => {
  const { data: farcasterData } = useFarcasterData({ address });
  const { data: ensData } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const ens = AddressEnsMappings[address.toLowerCase()] || ensData;
  const { name: fname } = farcasterData;

  const data = fname || (ens && (shouldTruncate ? truncateEns(ens) : ens)) || defaultValue;
  return { data };
};
