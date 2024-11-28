import { useMemo, useState } from "react";
import { useBlockNumber, useNetwork } from "wagmi";

import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { formatScientific } from "utils/format";
import { useUnionDataApi } from "hooks/useUnionDataApi";
import { DataApiNetworks, LEADERBOARD_PAGE_SIZE, SortOrder, ZERO } from "constants";
import { useProtocolData } from "providers/ProtocolData";
import { LastRepayFormatted } from "components/shared/LastRepayFormatted";
import { DataApiStatusBadge } from "components/shared/DataApiStatusBadge";
import { useToken } from "hooks/useToken";
import { base } from "providers/Network";

const columns = {
  CREDIT_LIMIT: {
    label: "Credit Limit",
    sort: "contracts.vouches.amount_received",
  },
  BALANCE_OWED: {
    label: "Balance Owed",
    sort: "contracts.total_owed.total",
  },
  LAST_PAYMENT: {
    label: "Last Payment",
    sort: "credit.repays.blocks.last",
  },
  STATUS: {
    label: "Status",
  },
};

export const TopCreditLimitsBoard = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    type: "CREDIT_LIMIT",
    order: SortOrder.DESC,
  });

  const { unit } = useToken();
  const { chain: connectedChain } = useNetwork();
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

  const { data: response = [] } = useUnionDataApi({
    network: DataApiNetworks[chainId],
    page,
    size: LEADERBOARD_PAGE_SIZE,
    sort: sortQuery,
  });

  const { pagination, items } = response;

  const rows =
    items?.map((user) => {
      const { address, data } = user;
      const { credit, contracts } = data;

      return [
        address,
        formatScientific(contracts.vouches.amount_received, unit),
        formatScientific(contracts.total_owed.total, unit),
        <LastRepayFormatted key={address} lastRepay={credit.repays.blocks.last} />,
        <DataApiStatusBadge
          key={address}
          data={data}
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
      order: !sort.order ? SortOrder.DESC : sort.order === SortOrder.DESC ? SortOrder.ASC : null,
    });
  };

  return (
    <LeaderboardTable
      rows={rows}
      columns={columns}
      sort={sort}
      handleSort={handleSort}
      maxPages={Math.ceil(pagination?.total.value / LEADERBOARD_PAGE_SIZE) || 1}
      activePage={page}
      paginationOnChange={setPage}
    />
  );
};
