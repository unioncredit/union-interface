import "./LeaderboardTable.scss";

import {
  Table,
  TableRow,
  Pagination,
  EmptyState,
  TableHead,
  Card,
} from "@unioncredit/ui";
import usePagination from "hooks/usePagination";
import useVoteCasts from "hooks/useVoteCasts";
import { LeaderboardTableRow } from "components/dao/LeaderboardTableRow";

export function LeaderboardTable({ pageSize = 15 }) {
  const { data = [] } = useVoteCasts();

  const {
    data: voters,
    maxPages,
    activePage,
    onChange,
  } = usePagination(data, pageSize);

  if (voters.length <= 0) {
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
          <TableHead align="right">Votes cast</TableHead>
          <TableHead align="right">Wallet balance</TableHead>
          <TableHead align="right">Delegated VP</TableHead>
          <TableHead align="right">Total VP</TableHead>
        </TableRow>

        {voters.map(({ address, count }) => (
          <LeaderboardTableRow address={address} voteCount={count} />
        ))}
      </Table>

      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </div>
  );
}
