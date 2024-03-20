import { Button, Grid, Card, Dai, Usdc, ExternalIcon, NumericalBlock } from "@unioncredit/ui";
import { useProtocol } from "providers/ProtocolData";
import { useNetwork } from "wagmi";
import { mainnet, arbitrum } from "wagmi/chains";

import { ZERO } from "constants";
import format from "utils/format";
import { calculateInterestRate } from "utils/numbers";
import Token from "components/Token";

const getAnalyticsUrl = (chainId) => {
  switch (chainId) {
    case mainnet.id:
      return "https://data.union.finance/";
    case arbitrum.id:
      return "https://data.union.finance/arbitrum";
    default:
      return null;
  }
};

export default function GovernaceStats() {
  const { chain } = useNetwork();
  const { data: protocol = {} } = useProtocol();
  const analyticsUrl = getAnalyticsUrl(chain?.id);

  const {
    totalStaked = ZERO,
    totalBorrows = ZERO,
    getLoanableAmount = ZERO,
    borrowRatePerSecond = ZERO,
    borrowRatePerBlock = ZERO,
  } = protocol;

  const borrowRatePerUnit = borrowRatePerSecond || borrowRatePerBlock;

  return (
    <Card mb="24px">
      <Card.Header title="Protocol Stats" align="center" />
      <Card.Body>
        <Grid>
          <Grid.Row>
            <Grid.Col xs={6}>
              <NumericalBlock
                mt="8px"
                title="Total Staked"
                value={<Token value={format(totalStaked)} />}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <NumericalBlock
                mt="8px"
                title="Lending pool"
                value={<Token value={format(getLoanableAmount)} />}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <NumericalBlock
                mt="32px"
                title="Outstanding loans"
                value={<Token value={format(totalBorrows)} />}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              {chain && borrowRatePerBlock && (
                <NumericalBlock
                  mt="32px"
                  title="Interest rate"
                  value={`${format(calculateInterestRate(borrowRatePerUnit, chain.id).mul(100))}%`}
                />
              )}
            </Grid.Col>
          </Grid.Row>
          {analyticsUrl && (
            <Grid.Row>
              <Grid.Col>
                <Button
                  fluid
                  as="a"
                  href={analyticsUrl}
                  target="_blank"
                  mt="32px"
                  color="secondary"
                  variant="light"
                  label="Analytics"
                  icon={ExternalIcon}
                  iconPosition="end"
                  iconProps={{
                    style: {
                      width: "12px",
                      height: "12px",
                    },
                  }}
                />
              </Grid.Col>
            </Grid.Row>
          )}
        </Grid>
      </Card.Body>
    </Card>
  );
}
