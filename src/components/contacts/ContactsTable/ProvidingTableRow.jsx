import "./ProvidingTableRow.scss";

import { Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { Avatar, PrimaryLabel, StatusBadge } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import { ZERO } from "constants";
import format from "utils/format";
import { useBlockTime } from "hooks/useBlockTime";
import { parseMilliseconds } from "utils/date";
import cn from "classnames";
import { DimmableTableCell } from "components/contacts/ContactsTable/DimmableTableCell";
import { ContactIconBadgeRow } from "components/contacts/ContactsTable/ContactIconBadgeRow";

const formatTimestamp = (milliseconds) => {
  if (!milliseconds) {
    return null;
  }

  const { days, hours, minutes } = parseMilliseconds(milliseconds);

  return days > 0
    ? `${days} days`
    : hours > 0
    ? `${hours} hours`
    : minutes > 0
    ? `${minutes} minutes`
    : null;
};

export function ProvidingTableRow({
  data,
  chainId,
  setContact,
  receiving,
  overdueInMilliseconds,
}) {
  const {
    address,
    isOverdue,
    locking = ZERO,
    trust = ZERO,
    vouch = ZERO,
    lastRepay = ZERO,
  } = data;

  const { timestamp: lastRepayTimestamp, formatted: lastRepayFormatted } =
    useBlockTime(lastRepay, chainId);

  const today = new Date();
  const paymentDueTimestamp =
    lastRepayTimestamp && lastRepayTimestamp + overdueInMilliseconds;
  const paymentRelativeFormat =
    paymentDueTimestamp &&
    formatTimestamp(
      isOverdue
        ? today.getTime() - paymentDueTimestamp
        : paymentDueTimestamp - today.getTime()
    );

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
            {paymentRelativeFormat
              ? isOverdue
                ? `${paymentRelativeFormat} overdue`
                : `Next due in ${paymentRelativeFormat}`
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
