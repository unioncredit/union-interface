import { useState } from "react";
import { useEnsAvatar } from "wagmi";
import makeBlockie from "ethereum-blockies-base64";
import { Avatar as UnionUiAvatar } from "@unioncredit/ui";

export default function Avatar({ address, size }) {
  const [error, setError] = useState(false);

  const { data, isError, isLoading } = useEnsAvatar({
    addressOrName: address,
  });

  const blockie = makeBlockie(address);

  return (
    <UnionUiAvatar
      size={size}
      src={isError || isLoading || error ? blockie : data || blockie}
      onError={() => setError(true)}
    />
  );
}
