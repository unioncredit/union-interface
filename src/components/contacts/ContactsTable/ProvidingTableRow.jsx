import "./ProvidingTableRow.scss";

import { Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { Avatar, PrimaryLabel, StatusBadge } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import { ZERO } from "constants";
import format from "utils/format";
import cn from "classnames";
import { DimmableTableCell } from "components/contacts/ContactsTable/DimmableTableCell";
import { ContactIconBadgeRow } from "components/contacts/ContactsTable/ContactIconBadgeRow";
import { useLastRepayData } from "hooks/useLastRepayData";

export function ProvidingTableRow({ data, setContact, receiving }) {
  const {
    address,
    isOverdue,
    locking = ZERO,
    trust = ZERO,
    vouch = ZERO,
    lastRepay = ZERO,
  } = data;

  const { formatted: lastRepayFormatted, paymentDue } =
    useLastRepayData(lastRepay);

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

            <ContactIconBadgeRow providing={true} receiving={receiving} />
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
        dimmed={locking.eq(ZERO)}
        value={`${format(locking)} DAI`}
        className={cn({
          "table-cell--overdue": isOverdue,
        })}
      />

      <TableCell align="right" weight="medium">
        <Box direction="vertical" align="flex-end">
          <Text grey={800} m={0} size="medium" weight="medium">
            {lastRepayFormatted ?? "---"}
          </Text>

          <Text size="small" grey={400} m={0}>
            {locking.gt(ZERO)
              ? paymentDue.overdue
                ? `${paymentDue.formatted} overdue`
                : `Next due in ${paymentDue.formatted}`
              : "Nothing due"}
          </Text>
        </Box>
      </TableCell>

      <TableCell align="right">
        <StatusBadge address={address} />
      </TableCell>
    </TableRow>
  );
}
