import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Box, Grid, NumericalBlock } from "@unioncredit/ui";
import { BlockSpeed, SECONDS_PER_DAY, SECONDS_PER_HOUR, ZERO } from "constants";
import { commify } from "utils/format";
import { getVersion, Versions } from "providers/Version";

export function ProtocolPeriods({ protocol, chainId, ...props }) {
  const { overdueBlocks = ZERO, overdueTime = ZERO } = protocol;
  const versioned = (v1, v2) => (getVersion(chainId) === Versions.V1 ? v1 : v2);

  const overdueHours = versioned(overdueBlocks, overdueTime.mul(1000))
    .mul(versioned(BlockSpeed[chainId], 1))
    .div(SECONDS_PER_HOUR * 1000)
    .toNumber();

  const overdueDays = versioned(overdueBlocks, overdueTime.mul(1000))
    .mul(versioned(BlockSpeed[chainId], 1))
    .div(SECONDS_PER_DAY * 1000)
    .toNumber();

  const overdueFormatted = overdueHours < 48 ? overdueHours + " hours" : overdueDays + " days";

  const periods = [
    {
      title: "Payment",
      value: versioned(`${commify(overdueBlocks, 0)} Blocks`, `${commify(overdueTime, 0)} Seconds`),
      subtitle: `~${overdueFormatted}`,
    },
    {
      title: "Max. Overdue",
      value: "N/A",
    },
  ];

  return (
    <Box direction="vertical" {...props}>
      <ProtocolDataHeader title="Periods" subTitle="Time periods related to repayment of debts" />

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
