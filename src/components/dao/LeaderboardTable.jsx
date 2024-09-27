import "./LeaderboardTable.scss";

import { Table, TableRow, Pagination, EmptyState, TableHead, Card } from "@unioncredit/ui";
import usePagination from "hooks/usePagination";
import { LeaderboardTableRow } from "components/dao/LeaderboardTableRow";
import { useState } from "react";
import { SortOrder } from "constants";
import { SortableTableHead } from "components/shared/SortableTableHead";
import useVoters from "hooks/useVoters";

export function LeaderboardTable({ columns, rows: rowsData, sort, handleSort, pageSize = 15 }) {
  const { data: rows, maxPages, activePage, onChange } = usePagination(rowsData, pageSize);

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
          <TableHead>Account</TableHead>

          {Object.entries(columns).map(([key, { label }], index) => (
            <SortableTableHead
              key={index}
              align="right"
              order={sort.type === key && sort.order}
              onClick={() => handleSort(key)}
            >
              {label}
            </SortableTableHead>
          ))}
        </TableRow>

        {rows.map((data) => (
          <LeaderboardTableRow key={data.address} data={data} />
        ))}
      </Table>

      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </div>
  );
}
