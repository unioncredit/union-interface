import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Box, Grid, NumericalBlock } from "@unioncredit/ui";
import { BlockSpeed, ZERO } from "constants";
import { commify } from "utils/format";

export function ProtocolPeriods({ protocol, chainId, ...props }) {
  const { overdueBlocks = ZERO } = protocol;

  const overdueHours = overdueBlocks
    .mul(BlockSpeed[chainId])
    .div(3600000)
    .toNumber();

  const overdueDays = overdueBlocks
    .mul(BlockSpeed[chainId])
    .div(86400000)
    .toNumber();

  const overdueFormatted =
    overdueHours < 48 ? overdueHours + " hours" : overdueDays + " days";

  const periods = [
    {
      title: "Payment",
      value: `${commify(overdueBlocks, 0)} Blocks`,
      subtitle: `~${overdueFormatted}`,
    },
    {
      title: "Max. Overdue",
      value: "N/A",
    },
  ];

  return (
    <Box direction="vertical" {...props}>
      <ProtocolDataHeader
        title="Periods"
        subTitle="Time periods related to repayment of debts"
      />

      <Grid>
        <Grid.Row style={{ marginTop: "16px" }}>
          {periods.map((item) => (
            <Grid.Col key={item.title}>
              <NumericalBlock size="small" align="left" {...item} />
            </Grid.Col>
          ))}
        </Grid.Row>
      </Grid>
    </Box>
  );
}
