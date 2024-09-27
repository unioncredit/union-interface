import { SortOrder, ZERO } from "constants";
import useVoters from "../../../hooks/useVoters";
import { LeaderboardTable } from "../LeaderboardTable";
import { useState } from "react";
import { compactFormattedNumber } from "../../../utils/format";

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
      compactFormattedNumber(unionBalance),
      compactFormattedNumber(delegatedVotes.lt(ZERO) ? ZERO : delegatedVotes),
      compactFormattedNumber(votes),
    ];
  });

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

  return <LeaderboardTable columns={columns} sort={sort} handleSort={handleSort} rows={data} />;
};
