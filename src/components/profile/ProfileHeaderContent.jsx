import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Box, Heading, LinkOutIcon, Skeleton, Text, Tooltip } from "@unioncredit/ui";

import { AddressEnsMappings } from "constants";
import { truncateAddress, truncateEns } from "utils/truncateAddress";
import { blockExplorerAddress } from "utils/blockExplorer";
import useLabels from "hooks/useLabels";
import { useFarcasterData } from "hooks/useFarcasterData";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";

export const ProfileHeaderContent = ({ address, chainId }) => {
  const { getLabel } = useLabels();
  const [copied, copy] = useCopyToClipboard();
  const { data: farcasterData, loading: farcasterLoading } = useFarcasterData({ address });
  const { data } = useEnsName({
    address: address.toLowerCase(),
    chainId: mainnet.id,
  });

  const { name: fname } = farcasterData;
  const ens = AddressEnsMappings[address.toLowerCase()] || data;
  const name = getLabel(address) || (ens && truncateEns(ens));
  const title = fname || (ens && truncateEns(ens)) || truncateAddress(address);

  return (
    <Box className="ProfileHeader__content" direction="vertical" fluid>
      {farcasterLoading ? (
        <Skeleton shimmer width={150} grey={200} height={28} mb="4px" />
      ) : (
        <Heading mb={0}>{title}</Heading>
      )}

      <Box align="center" className="ProfileHeader__address">
        {farcasterLoading ? (
          <Skeleton shimmer width={100} grey={200} height={18} />
        ) : (
          <>
            {name && fname && (
              <Text m="0 4px 0 0" grey={500} size="medium" weight="medium">
                {name} ·
              </Text>
            )}

            <Tooltip position="bottom" content={copied ? "Copied to clipboard!" : address}>
              <Text
                m="0 4px 0 0"
                grey={500}
                size="medium"
                weight="medium"
                onClick={() => copy(address)}
              >
                {address.slice(0, 6)}
              </Text>
            </Tooltip>

            <a href={blockExplorerAddress(chainId, address)} target="_blank" rel="noreferrer">
              <LinkOutIcon width="18px" fill="black" />
            </a>
          </>
        )}
      </Box>
    </Box>
  );
};
