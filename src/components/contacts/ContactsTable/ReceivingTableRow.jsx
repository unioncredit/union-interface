import "./ProvidingTableRow.scss";

import { Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { Avatar, PrimaryLabel } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import { ZERO } from "constants";
import format from "utils/format";
import { DimmableTableCell } from "components/contacts/ContactsTable";

import { ReactComponent as BothRow } from "../../../images/BothRow.svg";
import { ReactComponent as ProvidingRow } from "../../../images/ProvidingRow.svg";
import { ReactComponent as ReceivingRow } from "../../../images/ReceivingRow.svg";
import { useToken } from "hooks/useToken";

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

export function ReceivingTableRow({ data, active, setContact, providing, receiving }) {
  const { token } = useToken();

  const { address, locking = ZERO, trust = ZERO, vouch = ZERO } = data;

  const borrowable = vouch - locking;

  const Icon = receiving ? (providing ? BothRow : ReceivingRow) : ProvidingRow;

  const columns = [
    {
      ...COLUMNS.TRUST_SET,
      value: (
        <DimmableTableCell
          key={COLUMNS.TRUST_SET.id}
          dimmed={trust === ZERO}
          value={`${format(trust, token)} ${token}`}
        />
      ),
    },
    {
      ...COLUMNS.TOTAL_VOUCH,
      value: (
        <DimmableTableCell
          key={COLUMNS.TOTAL_VOUCH.id}
          dimmed={vouch === ZERO}
          value={`${format(vouch, token)} ${token}`}
        />
      ),
    },
    {
      ...COLUMNS.REAL_VOUCH,
      value: (
        <DimmableTableCell
          key={COLUMNS.REAL_VOUCH.id}
          dimmed={vouch === ZERO}
          value={`${format(vouch, token)} ${token}`}
        />
      ),
    },
    {
      ...COLUMNS.LOCKING,
      value: (
        <DimmableTableCell
          key={COLUMNS.LOCKING.id}
          dimmed={locking === ZERO}
          value={`${format(locking, token)} ${token}`}
        />
      ),
    },
    {
      ...COLUMNS.BORROWABLE,
      value: (
        <DimmableTableCell
          key={COLUMNS.BORROWABLE.id}
          dimmed={borrowable === ZERO}
          value={`${format(borrowable, token)} ${token}`}
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

            <Icon className="ProvidingTableRow__icon" />
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
