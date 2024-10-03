import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { optimism } from "wagmi/chains";

import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { formatScientific } from "utils/format";
import { useUnionDataApi } from "hooks/useUnionDataApi";
import { DataApiNetworks, LEADERBOARD_PAGE_SIZE, SortOrder } from "constants";

const columns = {
  TOTAL_STAKE: {
    label: "Total Stake",
    sort: "contracts.stake.total",
  },
  UTILIZED_STAKE: {
    label: "Utilized",
    sort: "contracts.stake.locked",
  },
  VOUCHES_GIVEN: {
    label: "Vouches Given",
    sort: "contracts.vouches.number_given",
  },
};

export const SamaritansBoard = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    type: "UTILIZED_STAKE",
    order: SortOrder.DESC,
  });

  const { chain } = useAccount();

  const sortQuery = useMemo(
    () => ({
      field: columns[sort.type].sort,
      order: sort.order,
    }),
    [sort]
  );

  const { data: response = [] } = useUnionDataApi({
    network: DataApiNetworks[chain?.id] || DataApiNetworks[optimism.id],
    page,
    size: LEADERBOARD_PAGE_SIZE,
    sort: sortQuery,
  });

  const { pagination, items } = response;

  const rows =
    items?.map((user) => {
      const { address, data } = user;
      const { contracts } = data;

      return [
        address,
        formatScientific(contracts.stake.total),
        formatScientific(contracts.stake.locked),
        contracts.vouches.number_given,
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
