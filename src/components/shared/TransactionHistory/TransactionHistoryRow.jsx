import { useNetwork } from "wagmi";
import { Box, LinkOutIcon, TableCell, TableRow, Text } from "@unioncredit/ui";
import { format as dateFormat } from "date-fns";

import format from "utils/format";
import { TransactionTypes } from "constants";
import { Address } from "./Address";
import { TransactionIcon } from "./TransactionIcon";
import { blockExplorerTx } from "utils/blockExplorer";
import { useToken } from "hooks/useToken";
import { base } from "providers/Network";

// prettier-ignore
const texts = {
  [TransactionTypes.CANCEL]:    (x) => <>Cancel vouch <Address address={x.borrower} /></>,
  [TransactionTypes.BORROW]:    () => <>Borrow</>,
  [TransactionTypes.REPAY]:     () => <>Repayment</>,
  [TransactionTypes.TRUST]:     (x) => <>Trusted <Address address={x.borrower} /></>,
  [TransactionTypes.TRUSTED]:   (x) => <>Trusted by <Address address={x.staker} /></>,
  [TransactionTypes.REGISTER]:  () => <>Became a member</>,
};

export function TransactionHistoryRow({
  id,
  amount,
  type,
  staker,
  borrower,
  timestamp,
  applicant,
}) {
  const { chain } = useNetwork();
  const { token } = useToken();

  const transactionId = id.split("-")[0];
  const text = texts[type]({ amount, staker, borrower });

  if (!text) return null;

  console.log({ amount, token });

  return (
    <TableRow>
      <TableCell fixedSize>
        <TransactionIcon type={type} borrower={borrower} staker={staker} applicant={applicant} />
      </TableCell>

      <TableCell>
        <Box direction="vertical">
          <Text size="medium" weight="medium" grey={800} m={0}>
            {text}
          </Text>
          <Text size="small" grey={500} m={0}>
            {dateFormat(new Date(timestamp * 1000), "dd LLL yyyy HH:mm")}

            <a href={blockExplorerTx(chain.id, transactionId)} target="_blank" rel="noreferrer">
              <LinkOutIcon width="14px" style={{ margin: "0 0px -2px 2px" }} />
            </a>
          </Text>
        </Box>
      </TableCell>

      <TableCell align="right">
        {amount && (
          <Text grey={800} size="medium">
            {/* fixme: temp fix for subgraph issue */}
            {format(
              amount,
              type === TransactionTypes.BORROW && chain?.id === base.id ? "DAI" : token
            )}
          </Text>
        )}
      </TableCell>
    </TableRow>
  );
}
