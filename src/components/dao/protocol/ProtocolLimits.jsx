import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Box, Grid, NumericalBlock } from "@unioncredit/ui";
import { ZERO } from "constants";
import format from "utils/format";

export function ProtocolLimits({ protocol, useToken, ...props }) {
  const {
    minBorrow = ZERO,
    maxBorrow = ZERO,
    maxStakeAmount = ZERO,
    debtCeiling = ZERO,
  } = protocol;

  const limits = [
    {
      title: "Min. Borrow",
      value: format(minBorrow, useToken),
    },
    {
      title: "Max. Borrow",
      value: format(maxBorrow, useToken),
    },
    {
      title: "Max. Stake",
      value: format(maxStakeAmount, useToken),
    },
    {
      title: "Global Max.",
      value: format(debtCeiling, useToken),
    },
  ];

  return (
    <Box direction="vertical" {...props}>
      <ProtocolDataHeader
        title="Limits"
        subTitle="Simple minimum and maximum protocol parameters"
      />

      <Grid>
        <Grid.Row style={{ marginTop: "16px" }}>
          {limits.map((item) => (
            <Grid.Col key={item.title}>
              <NumericalBlock size="small" token={useToken.toLowerCase()} align="left" {...item} />
            </Grid.Col>
          ))}
        </Grid.Row>
      </Grid>
    </Box>
  );
}
