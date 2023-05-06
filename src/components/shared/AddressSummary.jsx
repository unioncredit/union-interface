import { useNetwork } from "wagmi";
import { Link } from "react-router-dom";
import {
  Heading,
  Badge,
  Box,
  BadgeRow,
  Skeleton,
  ProfileIcon,
  LinkOutIcon,
} from "@unioncredit/ui";

import { EIP3770 } from "constants";
import { Avatar, PrimaryLabel, StatusBadge } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { blockExplorerAddress } from "utils/blockExplorer";
import { getProfileUrl } from "utils/generateLinks";

export function AddressSummary({ address, ...props }) {
  const { chain } = useNetwork();
  const [copied, copy] = useCopyToClipboard();

  const blockExplorerLink = blockExplorerAddress(chain.id, address);

  if (!address) {
    return (
      <Box direction="vertical" mb="24px">
        <Box mt="2px" align="center">
          <Skeleton variant="circle" size={54} grey={200} mr="8px" />
          <Box direction="vertical">
            <Skeleton width={80} height={22} grey={200} m={0} />
            <Box mt="8px">
              <Skeleton width={72} height={18} grey={100} />
              <Skeleton width={72} height={18} grey={100} ml="4px" />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box mb="24px" align="center" {...props}>
      <Box align="center">
        <Link to={`/profile/${EIP3770[chain.id]}:${address}`}>
          <Avatar size={64} address={address} />
        </Link>

        <Box direction="vertical" mx="12px">
          <Link to={`/profile/${EIP3770[chain.id]}:${address}`}>
            <Box>
              <Heading level={2} mb="4px">
                <PrimaryLabel address={address} />
              </Heading>
            </Box>
          </Link>
          <Box align="center">
            <BadgeRow>
              <Badge
                mr="4px"
                color="grey"
                onClick={() => copy(address)}
                label={copied ? "Copied" : truncateAddress(address)}
              />
              <StatusBadge address={address} />
            </BadgeRow>

            <a href={getProfileUrl(address, chain.id)}>
              <ProfileIcon width="24px" style={{ marginLeft: "4px" }} />
            </a>

            <a href={blockExplorerLink} target="_blank" rel="noreferrer">
              <LinkOutIcon
                width="24px"
                fill="#44403c"
                className="fillPath"
                style={{ marginLeft: "4px" }}
              />
            </a>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
