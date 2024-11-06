import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Grid, NumericalBlock } from "@unioncredit/ui";
import { ZERO } from "constants";
import format from "utils/format";

export function ProtocolBalances({ protocol }) {
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
        value: format(getLoanableAmount),
      },
      {
        title: "Borrowed",
        value: format(totalBorrows),
      },
      {
        title: "Reserves",
        value: format(totalReserves),
      },
    ],
    [
      {
        title: "Staked",
        value: format(totalStaked),
      },
      {
        title: "Effective stake",
        value: format(totalStaked.sub(totalFrozen)),
      },
      {
        title: "Locked",
        value: format(ZERO),
      },
    ],
    [
      {
        title: "Frozen",
        value: format(totalFrozen),
      },
    ],
  ];

  return (
    <>
      <ProtocolDataHeader
        title="Balances"
        subTitle="Important balances across the protocol"
      />

      <Grid>
        {balances.map((row, index) => (
          <Grid.Row key={index} style={{ marginTop: "16px" }}>
            {row.map((item) => (
              <Grid.Col key={item.title}>
                <NumericalBlock
                  size="small"
                  token="dai"
                  align="left"
                  {...item}
                />
              </Grid.Col>
            ))}
          </Grid.Row>
        ))}
      </Grid>
    </>
  );
}
