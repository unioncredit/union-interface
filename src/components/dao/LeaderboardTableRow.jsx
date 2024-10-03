import { Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { Avatar, PrimaryLabel } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import { isAddress } from "ethers/lib/utils";

export function LeaderboardTableRow({ data }) {
  const address = data?.[0] || null;

  if (!address || !isAddress(address)) {
    throw new Error("Invalid address provided: " + address);
  }

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

      {data.slice(1).map((row, i) => (
        <TableCell key={i} align="right">
          {row}
        </TableCell>
      ))}
    </TableRow>
  );
}
