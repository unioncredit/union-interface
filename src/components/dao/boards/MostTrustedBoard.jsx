import { useMemo, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useAccount } from "wagmi";
import { base } from "viem/chains";

import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { formatScientific } from "utils/format";
import { LEADERBOARD_PAGE_SIZE, SortOrder } from "constants";
import { useToken } from "hooks/useToken";

const columns = {
  VOUCHERS: {
    label: "Vouchers",
    sort: "voucherCount",
  },
  VOUCHEES: {
    label: "Vouchees",
    sort: "voucheeCount",
  },
  CREDIT_LIMIT: {
    label: "Credit Limit",
    sort: "vouchReceived",
  },
};

const MOST_TRUSTED_QUERY = gql`
  query MostTrustedQuery ($orderBy: String!, $orderDirection: String!, $chainId: Int!) {
    accounts (
      limit: 100,
      orderBy: $orderBy,
      orderDirection: $orderDirection,
      where: {
        chainId: $chainId
      }
    ) {
      items {
        address
        voucherCount
        voucheeCount
        vouchReceived
      }
    }
  }
`;

export const MostTrustedBoard = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    type: "VOUCHERS",
    order: SortOrder.DESC,
  });

  const sortQuery = useMemo(
    () => ({
      field: columns[sort.type].sort,
      order: sort.order,
    }),
    [sort]
  );

  const { unit } = useToken();
  const { chain: connectedChain } = useAccount();
  const { data } = useQuery(MOST_TRUSTED_QUERY, {
    variables: {
      orderBy: sortQuery.field,
      orderDirection: sortQuery.order,
      chainId: connectedChain?.id || base.id,
    }
  });

  const items = data?.accounts.items || [];

  const rows = (
    items?.map((item) => {
      return [
        item.address,
        item.voucherCount,
        item.voucheeCount,
        formatScientific(item.vouchReceived, unit),
      ];
    }) || []
  );

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
      rows={rows.slice((page - 1) * LEADERBOARD_PAGE_SIZE, page * LEADERBOARD_PAGE_SIZE)}
      columns={columns}
      sort={sort}
      handleSort={handleSort}
      maxPages={Math.ceil(items.length / LEADERBOARD_PAGE_SIZE) || 1}
      activePage={page}
      paginationOnChange={setPage}
    />
  );
};
