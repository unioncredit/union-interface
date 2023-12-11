import "./TransactionHistory.scss";

import { Table, TableCell, TableRow, Skeleton, Pagination, TableHead, Box } from "@unioncredit/ui";

import { ZERO_ADDRESS } from "constants";
import useTxHistory from "hooks/useTxHistory";
import usePagination from "hooks/usePagination";
import { TransactionHistoryRow } from "./TransactionHistoryRow";

export function TransactionHistory({
  pageSize = 8,
  staker = ZERO_ADDRESS,
  borrower = ZERO_ADDRESS,
  showEmptyRows = false,
}) {
  const { data = [], loading = true } = useTxHistory({ staker, borrower });

  const { data: transactionPage, maxPages, activePage, onChange } = usePagination(data, pageSize);

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

        {loading &&
          Array(pageSize)
            .fill(null)
            .map((_, i) => (
              <TableRow key={i}>
                <TableCell fixedSize>
                  <Skeleton shimmer variant="circle" size={28} grey={200} />
                </TableCell>
                <TableCell>
                  <Skeleton shimmer width={120} height={22} grey={200} />
                  <Skeleton shimmer width={60} height={12} grey={200} mt="6px" />
                </TableCell>
                <TableCell align="right">
                  <Skeleton shimmer width={60} height={24} grey={200} />
                </TableCell>
              </TableRow>
            ))}

        {showEmptyRows &&
          !loading &&
          data.length > 0 &&
          data.length < pageSize &&
          Array(pageSize - data.length)
            .fill(null)
            .map((_, i) => (
              <TableRow key={i}>
                <Box style={{ height: "61px" }}></Box>
              </TableRow>
            ))}
      </Table>

      {loading ? (
        <Box style={{ height: "60px", borderTop: "1px solid #ddd" }} />
      ) : (
        <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
      )}
    </div>
  );
}
