import { useMemo, useState } from "react";
import { useAccount, useBlockNumber } from "wagmi";
import { base } from "viem/chains";
import { gql, useQuery } from "@apollo/client";

import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { formatScientific } from "utils/format";
import { LEADERBOARD_PAGE_SIZE, SortOrder, ZERO } from "constants";
import { useProtocolData } from "providers/ProtocolData";
import { LastRepayFormatted } from "components/shared/LastRepayFormatted";
import { GraphqlStatusBadge } from "components/shared/GraphqlStatusBadge";
import { useToken } from "hooks/useToken";

const columns = {
  CREDIT_LIMIT: {
    label: "Credit Limit",
    sort: "vouchReceived",
  },
  BALANCE_OWED: {
    label: "Balance Owed",
    sort: "owed",
  },
  LAST_PAYMENT: {
    label: "Last Payment",
    sort: "lastRepay",
  },
  STATUS: {
    label: "Status",
  },
};

const TOP_CREDIT_LIMITS_QUERY = gql`
  query TopCreditLimitsQuery ($orderBy: String!, $orderDirection: String!, $chainId: Int!) {
    accounts (
      limit: 100,
      orderBy: $orderBy,
      orderDirection: $orderDirection,
      where: {
        chainId: $chainId,
      }
    ) {
      items {
        address
        vouchReceived
        owed
        lastRepay
        isMember
        isOverdue
      }
    }
  }
`;

export const TopCreditLimitsBoard = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    type: "CREDIT_LIMIT",
    order: SortOrder.DESC,
  });

  const { chain: connectedChain } = useAccount();

  const { unit } = useToken();
  const chainId = connectedChain?.id || base.id;

  const { data: blockNumber } = useBlockNumber({
    chainId,
  });

  const { data: protocol } = useProtocolData(chainId);

  const sortQuery = useMemo(
    () => ({
      field: columns[sort.type].sort,
      order: sort.order,
    }),
    [sort]
  );

  const { data } = useQuery(TOP_CREDIT_LIMITS_QUERY, {
    variables: {
      orderBy: sortQuery.field,
      orderDirection: sortQuery.order,
      chainId: connectedChain?.id || base.id,
    }
  });

  const items = data?.accounts.items || [];

  const rows =
    items?.map((item) => {
      const address = item.address;

      return [
        address,
        formatScientific(item.vouchReceived, unit),
        formatScientific(item.owed, unit),
        <LastRepayFormatted key={address} lastRepay={item.lastRepay} />,
        <GraphqlStatusBadge
          key={address}
          data={item}
          protocol={protocol}
          blockNumber={blockNumber || ZERO}
        />,
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
