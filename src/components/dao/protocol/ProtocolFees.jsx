import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Box, Grid, NumericalBlock } from "@unioncredit/ui";
import { BlocksPerYear, ZERO } from "constants";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { toPercent } from "utils/numbers";

export function ProtocolFees({ protocol, chainId, ...props }) {
  const decimals = BigNumber.from(18);
  const { borrowRatePerBlock = ZERO, originationFee = ZERO } = protocol;

  const interest = formatUnits(
    borrowRatePerBlock.mul(BlocksPerYear[chainId]),
    decimals
  );

  const fee = formatUnits(originationFee, decimals);

  const fees = [
    {
      title: "APR",
      value: toPercent(interest || 0, 2),
    },
    {
      title: "Origination Fee",
      value: toPercent(fee || 0, 2),
    },
  ];

  return (
    <Box direction="vertical" {...props}>
      <ProtocolDataHeader
        title="Protocol Fees"
        subTitle="Currently set protocol fee parameters"
      />

      <Grid>
        <Grid.Row style={{ marginTop: "16px" }}>
          {fees.map((item) => (
            <Grid.Col key={item.title}>
              <NumericalBlock size="small" align="left" {...item} />
            </Grid.Col>
          ))}
        </Grid.Row>
      </Grid>
    </Box>
  );
}
