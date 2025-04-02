import { useState } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import makeBlockie from "ethereum-blockies-base64";
import { Avatar as UnionUiAvatar } from "@unioncredit/ui";
import { AddressAvatarMappings } from "../../constants";
import { normalize } from "viem/ens";
import { mainnet } from "viem/chains";

export function Avatar({ address, size }) {
  const [error, setError] = useState(false);

  const { data: name } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const { data, isError, isLoading } = useEnsAvatar({
    name: normalize(name),
    chainId: mainnet.id,
  });

  const blockie = makeBlockie(address);
  const overrideAvatar = AddressAvatarMappings[address.toLowerCase()];

  return (
    <UnionUiAvatar
      size={size}
      src={
        overrideAvatar ? overrideAvatar : isError || isLoading || error ? blockie : data || blockie
      }
      onError={() => setError(true)}
    />
  );
}
