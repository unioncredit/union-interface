import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Box, Grid, NumericalBlock } from "@unioncredit/ui";
import { BlocksPerYear, SECONDS_PER_YEAR, ZERO } from "constants";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { toPercent } from "utils/numbers";
import { getVersion, Versions } from "providers/Version";

export function ProtocolFees({ protocol, chainId, ...props }) {
  const decimals = BigNumber.from(18);
  const versioned = (v1, v2) => (getVersion(chainId) === Versions.V1 ? v1 : v2);

  const { borrowRatePerSecond = ZERO, borrowRatePerBlock = ZERO, originationFee = ZERO } = protocol;

  const borrowRatePerUnit = versioned(borrowRatePerBlock, borrowRatePerSecond);

  const interest = formatUnits(
    borrowRatePerUnit.mul(versioned(BlocksPerYear[chainId], SECONDS_PER_YEAR)),
    decimals
  );

  const fee = formatUnits(originationFee, decimals);

  const fees = [
    {
      title: "APR",
      value: toPercent(interest || 0, 2)
    },
    {
      title: "Origination Fee",
      value: toPercent(fee || 0, 2)
    }
  ];

  return (
    <Box direction="vertical" {...props}>
      <ProtocolDataHeader title="Protocol Fees" subTitle="Currently set protocol fee parameters" />

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
