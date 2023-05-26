import "./LeaderboardTable.scss";

import { Table, TableRow, Pagination, EmptyState, TableHead, Card } from "@unioncredit/ui";
import usePagination from "hooks/usePagination";
import { LeaderboardTableRow } from "components/dao/LeaderboardTableRow";
import { useState } from "react";
import { SortOrder } from "constants";
import { SortableTableHead } from "components/shared/SortableTableHead";
import useVoters from "hooks/useVoters";

const columns = {
  VOTES_CAST: {
    label: "Votes cast",
    sort: {
      [SortOrder.ASC]: (a, b) => a.voteCount - b.voteCount,
      [SortOrder.DESC]: (a, b) => b.voteCount - a.voteCount,
    },
  },
  WALLET_BALANCE: {
    label: "Wallet balance",
    sort: {
      [SortOrder.ASC]: (a, b) => a.unionBalance.sub(b.unionBalance),
      [SortOrder.DESC]: (a, b) => b.unionBalance.sub(a.unionBalance),
    },
  },
  DELEGATED_VP: {
    label: "Delegated VP",
    sort: {
      [SortOrder.ASC]: (a, b) => a.delegatedVotes.sub(b.delegatedVotes),
      [SortOrder.DESC]: (a, b) => b.delegatedVotes.sub(a.delegatedVotes),
    },
  },
  TOTAL_VP: {
    label: "Total VP",
    sort: {
      [SortOrder.ASC]: (a, b) => a.votes.sub(b.votes),
      [SortOrder.DESC]: (a, b) => b.votes.sub(a.votes),
    },
  },
};

export function LeaderboardTable({ pageSize = 15 }) {
  const { data = [] } = useVoters();
  const [sort, setSort] = useState({
    type: "TOTAL_VP",
    order: SortOrder.DESC,
  });

  const {
    data: voters,
    maxPages,
    activePage,
    onChange,
  } = usePagination(sort.type ? data.sort(columns[sort.type].sort[sort.order]) : data, pageSize);

  if (voters.length <= 0) {
    return (
      <Card.Body>
        <EmptyState label="No addresses to show" />
      </Card.Body>
    );
  }

  const handleSort = (sortType) => {
    if (sort.type !== sortType) {
      return setSort({
        type: sortType,
        order: SortOrder.DESC,
      });
    }

    setSort({
      ...sort,
      order: !sort.order ? SortOrder.DESC : sort.order === SortOrder.DESC ? SortOrder.ASC : null,
    });
  };

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

        {voters.map((data) => (
          <LeaderboardTableRow key={data.address} data={data} />
        ))}
      </Table>

      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </div>
  );
}
