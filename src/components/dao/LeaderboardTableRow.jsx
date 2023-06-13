import { Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { Avatar, PrimaryLabel } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import { ZERO } from "constants";
import { compactFormattedNumber } from "utils/format";

export function LeaderboardTableRow({ data }) {
  const {
    address,
    unionBalance = ZERO,
    votes = ZERO,
    delegatedVotes = ZERO,
    voteCount = 0,
  } = data;

  return (
    <TableRow key={address}>
      <TableCell fixedSize>
        <Avatar size={24} address={address} />
      </TableCell>
      <TableCell>
        <Box direction="vertical">
          <Text grey={800} m={0} size="medium" weight="medium">
            <PrimaryLabel address={address} />
          </Text>
          <Text grey={500} m={0} size="small" weight="medium">
            {truncateAddress(address)}
          </Text>
        </Box>
      </TableCell>
      <TableCell align="right">{voteCount}</TableCell>
      <TableCell align="right">
        {compactFormattedNumber(unionBalance)}
      </TableCell>
      <TableCell align="right">
        {compactFormattedNumber(
          delegatedVotes.lt(ZERO) ? ZERO : delegatedVotes
        )}
      </TableCell>
      <TableCell align="right">{compactFormattedNumber(votes)}</TableCell>
    </TableRow>
  );
}
