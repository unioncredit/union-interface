import { useMemo, useState } from "react";
import { useAccount, useBalance, useBlockNumber } from "wagmi";
import { base } from "viem/chains";
import { gql, useQuery } from "@apollo/client";

import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { formatScientific } from "utils/format";
import { LEADERBOARD_PAGE_SIZE, SortOrder, ZERO } from "constants";
import { useProtocolData } from "providers/ProtocolData";
import { GraphqlStatusBadge } from "components/shared/GraphqlStatusBadge";
import { GiftMembershipButton } from "components/shared/GiftMembershipButton";
import { ConnectButton } from "components/shared";
import { useToken } from "hooks/useToken";

const columns = {
  CREDIT_LIMIT: {
    label: "Credit Limit",
    sort: "creditLimit",
  },
  VOUCHERS: {
    label: "Vouchers",
    sort: "voucherCount",
  },
  STATUS: {
    label: "Status",
  },
  ACTION: {
    label: "Action",
  },
};

const NOVICES_QUERY = gql`
  query NovicesQuery ($orderBy: String!, $orderDirection: String!, $chainId: Int!) {
    accounts (
      limit: 100,
      orderBy: $orderBy,
      orderDirection: $orderDirection
      where: {
        isMember: false,
        creditLimit_gt: "0",
        chainId: $chainId,
      }
    ) {
      items {
        address
        creditLimit
        voucherCount
      }
    }
  }
`;

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

  const { data } = useQuery(NOVICES_QUERY, {
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
        formatScientific(item.creditLimit, unit),
        item.voucherCount,
        <GraphqlStatusBadge
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
