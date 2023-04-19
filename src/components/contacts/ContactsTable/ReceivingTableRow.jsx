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

export const COLUMNS = {
  TRUST_SET: {
    id: "trust-set",
    label: "Trust set",
  },
  TOTAL_VOUCH: {
    id: "total-vouch",
    label: "Total vouch",
  },
  REAL_VOUCH: {
    id: "real-vouch",
    label: "Real vouch",
  },
  LOCKING: {
    id: "locking",
    label: "You're locking",
  },
  BORROWABLE: {
    id: "borrowable",
    label: "Borrowable",
  },
};

export function ReceivingTableRow({ data, active, setContact, providing }) {
  const { address, locked = ZERO, trust = ZERO, vouch = ZERO } = data;

  const borrowable = vouch.sub(locked);

  const columns = [
    {
      ...COLUMNS.TRUST_SET,
      value: (
        <DimmableTableCell
          dimmed={trust.eq(ZERO)}
          value={`${format(trust)} DAI`}
        />
      ),
    },
    {
      ...COLUMNS.TOTAL_VOUCH,
      value: (
        <DimmableTableCell
          dimmed={vouch.eq(ZERO)}
          value={`${format(vouch)} DAI`}
        />
      ),
    },
    {
      ...COLUMNS.REAL_VOUCH,
      value: (
        <DimmableTableCell
          dimmed={vouch.eq(ZERO)}
          value={`${format(vouch)} DAI`}
        />
      ),
    },
    {
      ...COLUMNS.LOCKING,
      value: (
        <DimmableTableCell
          dimmed={locked.eq(ZERO)}
          value={`${format(locked)} DAI`}
        />
      ),
    },
    {
      ...COLUMNS.BORROWABLE,
      value: (
        <DimmableTableCell
          dimmed={borrowable.eq(ZERO)}
          value={`${format(borrowable)} DAI`}
        />
      ),
    },
  ];

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

      {columns.map(({ id, value }) => (!active || active.id === id) && value)}
    </TableRow>
  );
}
