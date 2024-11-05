import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Grid, NumericalBlock } from "@unioncredit/ui";
import { ZERO } from "constants";
import format from "utils/format";
import { useToken } from "hooks/useToken";

export function ProtocolBalances({ protocol, chainId }) {
  const { token } = useToken(chainId);
  const {
    getLoanableAmount = ZERO,
    totalBorrows = ZERO,
    totalReserves = ZERO,
    totalStaked = ZERO,
    totalFrozen = ZERO,
  } = protocol;

  const balances = [
    [
      {
        title: "Available to borrow",
        value: format(getLoanableAmount, token),
      },
      {
        title: "Borrowed",
        value: format(totalBorrows, token),
      },
      {
        title: "Reserves",
        value: format(totalReserves, token),
      },
    ],
    [
      {
        title: "Staked",
        value: format(totalStaked, token),
      },
      {
        title: "Effective stake",
        value: format(totalStaked.sub(totalFrozen, token)),
      },
      {
        title: "Locked",
        value: format(ZERO, token),
      },
    ],
    [
      {
        title: "Frozen",
        value: format(totalFrozen, token),
      },
    ],
  ];

  return (
    <>
      <ProtocolDataHeader title="Balances" subTitle="Important balances across the protocol" />

      <Grid>
        {balances.map((row, index) => (
          <Grid.Row key={index} style={{ marginTop: "16px" }}>
            {row.map((item) => (
              <Grid.Col key={item.title}>
                <NumericalBlock size="small" token={token.toLowerCase()} align="left" {...item} />
              </Grid.Col>
            ))}
          </Grid.Row>
        ))}
      </Grid>
    </>
  );
}
