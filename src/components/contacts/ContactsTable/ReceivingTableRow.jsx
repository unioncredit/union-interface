import "./ProvidingTableRow.scss";

import { Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { Avatar, PrimaryLabel } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import { ZERO } from "constants";
import format from "utils/format";
import {
  ContactIconBadgeRow,
  DimmableTableCell,
} from "components/contacts/ContactsTable";

export function ReceivingTableRow({ data, setContact, providing }) {
  const { address, locked = ZERO, trust = ZERO, vouch = ZERO } = data;

  const borrowable = vouch.sub(locked);

  return (
    <TableRow className="ProvidingTableRow" onClick={() => setContact(data)}>
      <TableCell fixedSize>
        <Avatar size={24} address={address} />
      </TableCell>

      <TableCell>
        <Box direction="vertical">
          <Box align="center">
            <Text grey={800} m={0} size="medium" weight="medium">
              <PrimaryLabel address={address} />
            </Text>

            <ContactIconBadgeRow providing={providing} receiving={true} />
          </Box>

          <Text size="small" grey={500} m={0} weight="medium">
            {truncateAddress(address)}
          </Text>
        </Box>
      </TableCell>

      <DimmableTableCell
        dimmed={trust.eq(ZERO)}
        value={`${format(trust)} DAI`}
      />

      <DimmableTableCell
        dimmed={vouch.eq(ZERO)}
        value={`${format(vouch)} DAI`}
      />

      <DimmableTableCell
        dimmed={vouch.eq(ZERO)}
        value={`${format(vouch)} DAI`}
      />

      <DimmableTableCell
        dimmed={locked.eq(ZERO)}
        value={`${format(locked)} DAI`}
      />

      <DimmableTableCell
        dimmed={borrowable.eq(ZERO)}
        value={`${format(borrowable)} DAI`}
      />
    </TableRow>
  );
}
