import { Stat, Button, Grid, Card, Dai, ExternalIcon } from "@unioncredit/ui";
import { useProtocol } from "providers/ProtocolData";
import { chain, useNetwork } from "wagmi";

import { ZERO } from "constants";
import format from "utils/format";
import { calculateInterestRate } from "utils/numbers";

const getAnalyticsUrl = (chainId) => {
  switch (chainId) {
    case chain.mainnet.id:
      return "https://data.union.finance/";
    case chain.arbitrum.id:
      return "https://data.union.finance/arbitrum";
    default:
      return null;
  }
};

export default function GovernaceStats() {
  const { chain } = useNetwork();
  const { data: protocol = {} } = useProtocol();
  const analyticsUrl = getAnalyticsUrl(chain.id);

  const {
    totalStaked = ZERO,
    totalBorrows = ZERO,
    getLoanableAmount = ZERO,
  } = protocol;

  return (
    <Card mb="24px">
      <Card.Header title="Protocol Stats" align="center" />
      <Card.Body>
        <Grid>
          <Grid.Row>
            <Grid.Col xs={6}>
              <Stat
                mt="8px"
                align="center"
                label="Total Staked"
                value={<Dai value={format(totalStaked)} />}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Stat
                mt="8px"
                label="Lending pool"
                align="center"
                value={<Dai value={format(getLoanableAmount)} />}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Stat
                mt="32px"
                align="center"
                label="Outstanding loans"
                value={<Dai value={format(totalBorrows)} />}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              {protocol.borrowRatePerBlock && (
                <Stat
                  mt="32px"
                  align="center"
                  label="Interest rate"
                  value={`${format(
                    calculateInterestRate(
                      protocol.borrowRatePerBlock,
                      chain.id
                    ).mul(100)
                  )}%`}
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
