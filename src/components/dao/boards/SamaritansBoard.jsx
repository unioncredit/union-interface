import { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";

import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { formatScientific } from "utils/format";
import { LEADERBOARD_PAGE_SIZE, SortOrder, TOKENS, UNIT } from "constants";

const columns = {
  TOTAL_STAKE: {
    label: "Total Stake",
    sort: "totalStake",
  },
  UTILIZED_STAKE: {
    label: "Utilized",
    sort: "totalLockedStake",
  },
  VOUCHES_GIVEN: {
    label: "Vouches Given",
    sort: "voucheeCount",
  },
};

const SAMARITANS_QUERY = gql`
  query SamaritansQuery ($orderBy: String!, $orderDirection: String!) {
    accounts (
      limit: 100,
      orderBy: $orderBy,
      orderDirection: $orderDirection
    ) {
      items {
        address
        totalStake
        totalLockedStake
        voucheeCount
      }
    }
  }
`;

export const SamaritansBoard = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    type: "UTILIZED_STAKE",
    order: SortOrder.DESC,
  });

  const sortQuery = useMemo(
    () => ({
      field: columns[sort.type].sort,
      order: sort.order,
    }),
    [sort]
  );

  const { data } = useQuery(SAMARITANS_QUERY, {
    variables: {
      orderBy: sortQuery.field,
      orderDirection: sortQuery.order,
    }
  });

  const unit = UNIT[TOKENS.USDC];
  const items = data?.accounts.items || [];

  const rows =
    items?.map((item) => {
      return [
        item.address,
        formatScientific(item.totalStake, unit),
        formatScientific(item.totalLockedStake, unit),
        item.voucheeCount,
      ];
    }) || [];

  const handleSort = (sortType) => {
    if (sort.type !== sortType) {
      return setSort({
        type: sortType,
        order: SortOrder.DESC,
      });
    }

    setSort({
      ...sort,
      order: !sort.order ? SortOrder.DESC : sort.order === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC,
    });
  };

  return (
    <LeaderboardTable
      rows={rows}
      columns={columns}
      sort={sort}
      handleSort={handleSort}
      maxPages={Math.ceil(items.length / LEADERBOARD_PAGE_SIZE) || 1}
      activePage={page}
      paginationOnChange={setPage}
    />
  );
};
