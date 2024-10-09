import "./LeaderboardTable.scss";

import { Card, EmptyState, Pagination, Table, TableHead, TableRow } from "@unioncredit/ui";

import { LeaderboardTableRow } from "components/dao/LeaderboardTableRow";
import { SortableTableHead } from "components/shared/SortableTableHead";

export function LeaderboardTable({
  columns,
  rows,
  sort,
  handleSort,
  maxPages,
  activePage,
  paginationOnChange,
}) {
  if (rows.length <= 0) {
    return (
      <Card.Body>
        <EmptyState label="No addresses to show" />
      </Card.Body>
    );
  }

  return (
    <div className="LeaderboardTable">
      <Table>
        <TableRow>
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead>Account</TableHead>

          {Object.entries(columns).map(([key, { sort: hasSort, label }], index) =>
            hasSort ? (
              <SortableTableHead
                key={index}
                align="right"
                order={sort.type === key && sort.order}
                onClick={() => handleSort(key)}
              >
                {label}
              </SortableTableHead>
            ) : (
              <TableHead key={index} align="right">
                {label}
              </TableHead>
            )
          )}
        </TableRow>

        {rows.map((data, i) => (
          <LeaderboardTableRow key={data.address} data={data} num={(activePage - 1) * 15 + i + 1} />
        ))}
      </Table>

      <Pagination pages={maxPages} activePage={activePage} onClick={paginationOnChange} />
    </div>
  );
}
