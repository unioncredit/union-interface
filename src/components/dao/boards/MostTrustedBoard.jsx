import { useMemo, useState } from "react";
import { useNetwork } from "wagmi";
import { optimism } from "wagmi/chains";

import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { formatScientific } from "utils/format";
import { useUnionDataApi } from "hooks/useUnionDataApi";
import { DataApiNetworks, LEADERBOARD_PAGE_SIZE, SortOrder } from "constants";

const columns = {
  VOUCHERS: {
    label: "Vouchers",
    sort: "contracts.vouches.number_received",
  },
  VOUCHEES: {
    label: "Vouchees",
    sort: "contracts.vouches.number_given",
  },
  CREDIT_LIMIT: {
    label: "Credit Limit",
    sort: "contracts.vouches.amount_received",
  },
};

export const MostTrustedBoard = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    type: "VOUCHERS",
    order: SortOrder.DESC,
  });

  const { chain } = useNetwork();

  const sortQuery = useMemo(
    () => ({
      field: columns[sort.type].sort,
      order: sort.order,
    }),
    [sort]
  );

  console.log({ chain });

  const { data: response = [] } = useUnionDataApi({
    network: DataApiNetworks[chain?.id] || DataApiNetworks[optimism.id],
    page,
    size: LEADERBOARD_PAGE_SIZE,
    sort: sortQuery,
  });

  console.log({ response });

  const { pagination, items } = response;

  const rows =
    items?.map((user) => {
      const { address, data } = user;
      const { contracts } = data;

      return [
        address,
        contracts.vouches.number_received,
        contracts.vouches.number_given,
        formatScientific(contracts.vouches.amount_received),
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
