import React, { useState } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import makeBlockie from "ethereum-blockies-base64";
import { IconLabel } from "@unioncredit/ui";
import { truncateAddress } from "../../utils/truncateAddress";
import useLabels from "../../hooks/useLabels";

export function EnsIconLabel({ address }) {
  const { getLabel } = useLabels();

  const [error, setError] = useState(false);

  const {
    data: ensAvatar,
    isError,
    isLoading,
  } = useEnsAvatar({
    address,
    chainId: mainnet.id,
  });

  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const blockie = makeBlockie(address);
  const label = getLabel(address);
  const primaryLabel = label || ensName || truncateAddress(address);

  return (
    <IconLabel
      ml="8px"
      label={primaryLabel}
      src={isError || isLoading || error ? blockie : ensAvatar || blockie}
      onError={() => setError(true)}
    />
  );
}
