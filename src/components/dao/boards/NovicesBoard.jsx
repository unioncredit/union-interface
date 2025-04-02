import { useMemo, useState } from "react";
import { useAccount, useBalance, useBlockNumber } from "wagmi";

import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { formatScientific } from "utils/format";
import { useUnionDataApi } from "hooks/useUnionDataApi";
import { DataApiNetworks, LEADERBOARD_PAGE_SIZE, SortOrder, ZERO } from "constants";
import { useProtocolData } from "providers/ProtocolData";
import { DataApiStatusBadge } from "components/shared/DataApiStatusBadge";
import { GiftMembershipButton } from "components/shared/GiftMembershipButton";
import { ConnectButton } from "components/shared";
import { useToken } from "hooks/useToken";
import { base } from "viem/chains";

const columns = {
  CREDIT_LIMIT: {
    label: "Credit Limit",
    sort: "contracts.credit_limit",
  },
  VOUCHERS: {
    label: "Vouchers",
    sort: "contracts.vouches.number_received",
  },
  STATUS: {
    label: "Status",
  },
  ACTION: {
    label: "Action",
  },
};

export const NovicesBoard = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    type: "CREDIT_LIMIT",
    order: SortOrder.DESC,
  });

  const { unit } = useToken();
  const { chain: connectedChain, isConnected, address: connectedAddress } = useAccount();
  const chainId = connectedChain?.id || base.id;

  const { data: blockNumber } = useBlockNumber({
    chainId,
  });

  const { data: protocol } = useProtocolData(chainId);

  const { data: balance } = useBalance({
    address: connectedAddress,
  });

  const { regFee = ZERO, rebate = ZERO, value: ethBalance = ZERO } = { ...protocol, ...balance };

  const ethRegisterFee = regFee + rebate;
  const canRegister = ethRegisterFee <= ethBalance;

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
    query: {
      "contracts.is_member": false,
      "contracts.credit_limit": {
        gt: 0,
      },
    },
  });

  const { pagination, items } = response;

  const rows =
    items?.map((user) => {
      const { address, data } = user;
      const { contracts } = data;

      return [
        address,
        formatScientific(contracts.credit_limit, unit),
        contracts.vouches.number_received,
        <DataApiStatusBadge
          key={address}
          data={data}
          protocol={protocol}
          blockNumber={blockNumber || ZERO}
        />,
        isConnected ? (
          <GiftMembershipButton
            key={address}
            address={address}
            referrer={connectedAddress}
            ethRegisterFee={ethRegisterFee}
            canRegister={canRegister}
          />
        ) : (
          <ConnectButton
            buttonProps={{ style: { height: "36px", padding: "12px", marginLeft: "auto" } }}
          />
        ),
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
