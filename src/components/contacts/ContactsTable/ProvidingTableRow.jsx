import "./ProvidingTableRow.scss";

import { Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { Avatar, PrimaryLabel, StatusBadge } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import { ContactsType, ZERO } from "constants";
import format from "utils/format";
import cn from "classnames";
import { DimmableTableCell } from "components/contacts/ContactsTable/DimmableTableCell";
import { useLastRepayData } from "hooks/useLastRepayData";
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
  STAKE_LOCKED: {
    id: "stake-locked",
    label: "Stake locked",
  },
  LAST_PAYMENT: {
    id: "last-payment",
    label: "Last payment",
  },
  LOAN_STATUS: {
    id: "loan-status",
    label: "Loan status",
  },
};

export function ProvidingTableRow({ data, active, setContact, providing, receiving }) {
  const { address, isOverdue, locking = ZERO, trust = ZERO, vouch = ZERO, lastRepay = ZERO } = data;
  const { token } = useToken();
  const { formatted: lastRepayFormatted, paymentDue } = useLastRepayData(lastRepay);

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
      ...COLUMNS.STAKE_LOCKED,
      value: (
        <DimmableTableCell
          key={COLUMNS.STAKE_LOCKED.id}
          dimmed={locking === ZERO}
          value={`${format(locking, token)} ${token}`}
          className={cn({
            "table-cell--overdue": isOverdue && locking > ZERO,
          })}
        />
      ),
    },
    {
      ...COLUMNS.LAST_PAYMENT,
      value: (
        <TableCell key={COLUMNS.LAST_PAYMENT.id} align="right" weight="medium">
          <Box direction="vertical" align="flex-end">
            <Text grey={800} m={0} size="medium" weight="medium">
              {lastRepayFormatted ?? "---"}
            </Text>

            <Text size="small" grey={400} m={0}>
              {locking > ZERO
                ? paymentDue.overdue
                  ? `${paymentDue.formatted} overdue`
                  : `Next due in ${paymentDue.formatted}`
                : "Nothing due"}
            </Text>
          </Box>
        </TableCell>
      ),
    },
    {
      ...COLUMNS.LOAN_STATUS,
      value: (
        <TableCell key={COLUMNS.LOAN_STATUS.id} align="right">
          <Box justify="flex-end" minw="120px">
            <StatusBadge address={address} type={ContactsType.VOUCHEES} />
          </Box>
        </TableCell>
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
