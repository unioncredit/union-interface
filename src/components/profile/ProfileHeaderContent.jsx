import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Badge, Box, Heading, LinkOutIcon, Skeleton, Text } from "@unioncredit/ui";

import { AddressEnsMappings } from "constants";
import { truncateAddress, truncateEns } from "utils/truncateAddress";
import { blockExplorerAddress } from "utils/blockExplorer";
import useLabels from "hooks/useLabels";
import { useFarcasterData } from "hooks/useFarcasterData";
import useCopyToClipboard from "hooks/useCopyToClipboard";

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

      <Box mt="4px" align="center" className="ProfileHeader__address">
        {farcasterLoading ? (
          <Skeleton shimmer width={100} grey={200} height={18} />
        ) : (
          <>
            <Badge
              p="2px 8px"
              color="grey"
              onClick={() => copy(address)}
              label={copied ? "Copied" : address.slice(0, 6)}
            />

            {name && fname && (
              <Text m="0 4px" grey={500} size="medium" weight="medium">
                · {name}
              </Text>
            )}

            <a href={blockExplorerAddress(chainId, address)} target="_blank" rel="noreferrer">
              <LinkOutIcon width="18px" fill="black" />
            </a>
          </>
        )}
      </Box>
    </Box>
  );
};
