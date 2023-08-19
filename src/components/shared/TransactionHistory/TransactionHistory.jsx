import "./TransactionHistory.scss";

import {
  Table,
  TableCell,
  TableRow,
  Skeleton,
  Pagination,
  EmptyState,
  TableHead,
  Card,
} from "@unioncredit/ui";

import { ZERO_ADDRESS } from "constants";
import useTxHistory from "hooks/useTxHistory";
import usePagination from "hooks/usePagination";
import { TransactionHistoryRow } from "./TransactionHistoryRow";

export function TransactionHistory({
  pageSize = 8,
  staker = ZERO_ADDRESS,
  borrower = ZERO_ADDRESS,
}) {
  const { data = [] } = useTxHistory({ staker, borrower });

  const { data: transactionPage, maxPages, activePage, onChange } = usePagination(data, pageSize);

  if (data.length <= 0) {
    return (
      <Card.Body>
        <EmptyState label="No transactions" />
      </Card.Body>
    );
  }

  return (
    <div className="TransactionHistory">
      <Table>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Transaction</TableHead>
          <TableHead align="right">Value (DAI)</TableHead>
        </TableRow>

        {transactionPage.map((tx, i) => (
          <TransactionHistoryRow key={i} {...tx} />
        ))}

        {!data &&
          Array(3)
            .fill(null)
            .map((_, i) => (
              <TableRow key={i}>
                <TableCell fixedSize>
                  <Skeleton shimmer variant="circle" size={24} grey={200} />
                </TableCell>
                <TableCell>
                  <Skeleton shimmer width={60} height={10} grey={200} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton shimmer width={30} height={10} grey={200} />
                </TableCell>
              </TableRow>
            ))}
      </Table>

      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </div>
  );
}
