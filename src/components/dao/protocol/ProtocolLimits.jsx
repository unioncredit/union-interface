import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Box, Grid, NumericalBlock } from "@unioncredit/ui";
import { ZERO } from "constants";
import format from "utils/format";
import { useToken } from "hooks/useToken";

export function ProtocolLimits({ protocol, chainId, ...props }) {
  const { token } = useToken(chainId);
  const {
    minBorrow = ZERO,
    maxBorrow = ZERO,
    maxStakeAmount = ZERO,
    debtCeiling = ZERO,
  } = protocol;

  const limits = [
    {
      title: "Min. Borrow",
      value: format(minBorrow, token),
    },
    {
      title: "Max. Borrow",
      value: format(maxBorrow, token),
    },
    {
      title: "Max. Stake",
      value: format(maxStakeAmount, token),
    },
    {
      title: "Global Max.",
      value: format(debtCeiling, token),
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
              <NumericalBlock size="small" token={token.toLowerCase()} align="left" {...item} />
            </Grid.Col>
          ))}
        </Grid.Row>
      </Grid>
    </Box>
  );
}
