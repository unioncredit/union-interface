import { useState } from "react";
import { useEnsAvatar } from "wagmi";
import { mainnet } from "wagmi/chains";
import makeBlockie from "ethereum-blockies-base64";
import { Avatar as UnionUiAvatar } from "@unioncredit/ui";

export function Avatar({ address, size }) {
  const [error, setError] = useState(false);

  const { data, isError, isLoading } = useEnsAvatar({
    address: address,
    chainId: mainnet.id,
  });

  const blockie = makeBlockie(address);

  const avatarUrl =
    // eslint-disable-next-line no-undef
    process.env.REACT_APP_OPTIMIZE_IMAGES === "true" && data
      ? `/_vercel/image?url=${encodeURIComponent(data)}&w=${size}&q=100`
      : data;

  return (
    <UnionUiAvatar
      size={size}
      src={isError || isLoading || error ? blockie : avatarUrl || blockie}
      onError={() => setError(true)}
    />
  );
}
