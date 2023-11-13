import { Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { Avatar, PrimaryLabel } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import { ZERO, EIP3770 } from "constants";
import { compactFormattedNumber } from "utils/format";
import { Link } from "react-router-dom";
import { useNetwork } from "wagmi";

export function LeaderboardTableRow({ data }) {
  const { address, unionBalance = ZERO, votes = ZERO, delegatedVotes = ZERO, voteCount = 0 } = data;
  const { chain } = useNetwork();
  return (
    <TableRow key={address}>
      <TableCell fixedSize>
        <Link to={`/profile/${EIP3770[chain.id]}:${data.address}`}>
          <Avatar size={24} address={address} />
        </Link>
      </TableCell>
      <TableCell>
        <Link to={`/profile/${EIP3770[chain.id]}:${data.address}`}>
          <Box direction="vertical">
            <Text grey={800} m={0} size="medium" weight="medium">
              <PrimaryLabel address={address} />
            </Text>
            <Text grey={500} m={0} size="small" weight="medium">
              {truncateAddress(address)}
            </Text>
          </Box>
        </Link>
      </TableCell>
      <TableCell align="right">{voteCount}</TableCell>
      <TableCell align="right">{compactFormattedNumber(unionBalance)}</TableCell>
      <TableCell align="right">
        {compactFormattedNumber(delegatedVotes.lt(ZERO) ? ZERO : delegatedVotes)}
      </TableCell>
      <TableCell align="right">{compactFormattedNumber(votes)}</TableCell>
    </TableRow>
  );
}
