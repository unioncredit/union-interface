import { SortOrder, TOKENS, ZERO } from "constants";
import useVoters from "hooks/useVoters";
import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { useState } from "react";
import { compactFormattedNumber } from "utils/format";
import usePagination from "hooks/usePagination";

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
      [SortOrder.ASC]: (a, b) => Number(a.unionBalance - b.unionBalance),
      [SortOrder.DESC]: (a, b) => Number(b.unionBalance - a.unionBalance),
    },
  },
  DELEGATED_VP: {
    label: "Delegated VP",
    sort: {
      [SortOrder.ASC]: (a, b) => Number(a.delegatedVotes - b.delegatedVotes),
      [SortOrder.DESC]: (a, b) => Number(b.delegatedVotes - a.delegatedVotes),
    },
  },
  TOTAL_VP: {
    label: "Total VP",
    sort: {
      [SortOrder.ASC]: (a, b) => Number(a.votes - b.votes),
      [SortOrder.DESC]: (a, b) => Number(b.votes - a.votes),
    },
  },
};

export const DelegatesBoard = () => {
  const [sort, setSort] = useState({
    type: "TOTAL_VP",
    order: SortOrder.DESC,
  });

  const { data: voters = [] } = useVoters();
  const sorted = sort.type ? voters.sort(columns[sort.type].sort[sort.order]) : voters;
  const data = sorted.map((voter) => {
    const {
      address,
      unionBalance = ZERO,
      votes = ZERO,
      delegatedVotes = ZERO,
      voteCount = 0,
    } = voter;

    return [
      address,
      voteCount,
      compactFormattedNumber(unionBalance, TOKENS.UNION),
      compactFormattedNumber(delegatedVotes < ZERO ? ZERO : delegatedVotes, TOKENS.UNION),
      compactFormattedNumber(votes, TOKENS.UNION),
    ];
  });

  const { data: rows, maxPages, activePage, onChange } = usePagination(data, 15);

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
    <LeaderboardTable
      columns={columns}
      rows={rows}
      sort={sort}
      handleSort={handleSort}
      maxPages={maxPages}
      activePage={activePage}
      paginationOnChange={onChange}
    />
  );
};
