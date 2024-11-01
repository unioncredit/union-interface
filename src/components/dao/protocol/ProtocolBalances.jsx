import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Grid, NumericalBlock } from "@unioncredit/ui";
import { ZERO } from "constants";
import format from "utils/format";

export function ProtocolBalances({ protocol, useToken }) {
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
        value: format(getLoanableAmount, useToken),
      },
      {
        title: "Borrowed",
        value: format(totalBorrows, useToken),
      },
      {
        title: "Reserves",
        value: format(totalReserves, useToken),
      },
    ],
    [
      {
        title: "Staked",
        value: format(totalStaked, useToken),
      },
      {
        title: "Effective stake",
        value: format(totalStaked.sub(totalFrozen, useToken)),
      },
      {
        title: "Locked",
        value: format(ZERO, useToken),
      },
    ],
    [
      {
        title: "Frozen",
        value: format(totalFrozen, useToken),
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
                <NumericalBlock
                  size="small"
                  token={useToken.toLowerCase()}
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
