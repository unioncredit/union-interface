import { useState } from "react";
import { useEnsAvatar } from "wagmi";
import { mainnet } from "wagmi/chains";
import makeBlockie from "ethereum-blockies-base64";
import { Avatar as UnionUiAvatar } from "@unioncredit/ui";
import { AddressAvatarMappings } from "../../constants";

export function Avatar({ address, size }) {
  const [error, setError] = useState(false);

  const { data, isError, isLoading } = useEnsAvatar({
    address: address,
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
