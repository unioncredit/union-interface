import { Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { format as dateFormat } from "date-fns";

import format from "utils/format";
import { TransactionTypes } from "constants";
import { Address } from "./Address";
import { TransactionIcon } from "./TransactionIcon";

// prettier-ignore
const texts = {
  [TransactionTypes.CANCEL]:    (x) => <>Cancel vouch <Address address={x.borrower} /></>,
  [TransactionTypes.BORROW]:    (_) => <>Borrow</>,
  [TransactionTypes.REPAY]:     (_) => <>Repayment</>,
  [TransactionTypes.TRUST]:     (x) => <>Trusted <Address address={x.borrower} /></>,
  [TransactionTypes.TRUSTED]:   (x) => <>Trusted by <Address address={x.staker} /></>,
  [TransactionTypes.REGISTER]:  (_) => <>Became a member</>,
};

export function TransactionHistoryRow({
  amount,
  type,
  staker,
  borrower,
  timestamp,
  applicant,
}) {
  const text = texts[type]({ amount, staker, borrower });

  if (!text) return null;

  return (
    <TableRow>
      <TableCell fixedSize>
        <TransactionIcon
          type={type}
          borrower={borrower}
          staker={staker}
          applicant={applicant}
        />
      </TableCell>

      <TableCell>
        <Box direction="vertical">
          <Text size="medium" weight="medium" grey={800} m={0}>
            {text}
          </Text>
          <Text size="small" grey={500} m={0}>
            {dateFormat(new Date(timestamp * 1000), "dd LLL yyyy HH:mm")}
          </Text>
        </Box>
      </TableCell>

      <TableCell align="right">
        {amount && (
          <Text grey={800} size="medium">
            {format(amount)}
          </Text>
        )}
      </TableCell>
    </TableRow>
  );
}
