import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Box, Heading, LinkOutIcon, Text } from "@unioncredit/ui";

import { AddressEnsMappings } from "constants";
import { truncateAddress, truncateEns } from "utils/truncateAddress";
import { blockExplorerAddress } from "utils/blockExplorer";
import useLabels from "hooks/useLabels";
import { useFarcasterData } from "hooks/useFarcasterData";

export const ProfileHeaderContent = ({ address, chainId }) => {
  const { getLabel } = useLabels();
  const { data: farcasterData } = useFarcasterData({ address });
  const { data } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const { name: fname } = farcasterData;
  const ens = AddressEnsMappings[address.toLowerCase()] || data;
  const name = getLabel(address) || (ens && truncateEns(ens));
  const title = fname || truncateAddress(address);

  return (
    <Box className="ProfileHeader__content" direction="vertical" fluid>
      <Heading mb={0}>{title}</Heading>

      <Box align="center" className="ProfileHeader__address">
        {name && (
          <Text m="0 4px 0 0" grey={500} size="medium" weight="medium">
            {name} {fname && "·"}
          </Text>
        )}

        {fname && (
          <Text m="0 4px 0 0" grey={500} size="medium" weight="medium">
            {address.slice(0, 6)}
          </Text>
        )}

        {!name && !fname && (
          <Text m="0 4px 0 0" grey={500} size="medium" weight="medium">
            View on Etherscan
          </Text>
        )}

        <a href={blockExplorerAddress(chainId, address)} target="_blank" rel="noreferrer">
          <LinkOutIcon width="18px" fill="black" />
        </a>
      </Box>
    </Box>
  );
};
