import { Link } from "react-router-dom";
import { Heading, Badge, Box, BadgeRow, Skeleton } from "@unioncredit/ui";
import { ReactComponent as External } from "@unioncredit/ui/lib/icons/external.svg";

import Avatar from "components/shared/Avatar";
import PrimaryLabel from "components/shared/PrimaryLabel";
import { truncateAddress } from "utils/truncateAddress";
import StatusBadge from "./StatusBadge";
import useCopyToClipboard from "hooks/useCopyToClipboard";

export default function AddressSummary({ address }) {
  const [copied, copy] = useCopyToClipboard();

  const addressEtherscanLink = "";

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
    <Box mb="24px" align="center">
      <Box align="center">
        <Link to={`/profile/${address}`}>
          <Avatar size={54} address={address} />
        </Link>

        <Box direction="vertical" mx="12px">
          <Link to={`/profile/${address}`}>
            <Box>
              <Heading level={2} mb="4px">
                <PrimaryLabel address={address} />
              </Heading>
            </Box>
          </Link>
          <Box>
            <BadgeRow>
              <Badge
                mr="4px"
                color="grey"
                onClick={() => copy(address)}
                label={copied ? "Copied!" : truncateAddress(address)}
              />
              <StatusBadge address={address} />
            </BadgeRow>

            <a href={addressEtherscanLink} target="_blank" rel="noreferrer">
              <External width="24px" />
            </a>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
