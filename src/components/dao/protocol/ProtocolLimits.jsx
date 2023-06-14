import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Box, Grid, NumericalBlock } from "@unioncredit/ui";
import { ZERO } from "constants";
import format from "utils/format";

export function ProtocolLimits({ protocol, ...props }) {
  const { minBorrow = ZERO, maxBorrow = ZERO, debtCeiling = ZERO } = protocol;

  const limits = [
    {
      title: "Min. Borrow",
      value: format(minBorrow),
    },
    {
      title: "Max. Borrow",
      value: format(maxBorrow),
    },
    {
      title: "Global Max.",
      value: format(debtCeiling),
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
              <NumericalBlock size="small" token="dai" align="left" {...item} />
            </Grid.Col>
          ))}
        </Grid.Row>
      </Grid>
    </Box>
  );
}
