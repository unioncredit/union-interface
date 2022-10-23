import { Stat, Button, Grid, Card, Dai, Bar } from "@unioncredit/ui";

import format from "utils/format";
import { WAD, ZERO } from "constants";
import { reduceBnSum } from "utils/reduce";
import { useVouchees } from "providers/VoucheesData";
import { useMember } from "providers/MemberData";

export default function StakeStats() {
  const { data: member } = useMember();
  const { data: vouchees = [] } = useVouchees();

  const { stakedBalance = ZERO, totalLockedStake = ZERO } = member;

  const lockedPercentageBps = totalLockedStake.mul(WAD).div(stakedBalance);
  const lockedPercentage = Number(lockedPercentageBps.toString()) / 1e16;

  const defaulted = vouchees
    .map(({ isOverdue, locking }) => {
      return isOverdue ? locking : ZERO;
    })
    .reduce(reduceBnSum, ZERO);

  return (
    <Card>
      <Card.Header title="Staked Funds" align="center" />
      <Card.Body>
        <Grid>
          <Grid.Row>
            <Grid.Col xs={12}>
              <Stat
                size="large"
                align="center"
                label="Staked"
                value={<Dai value={format(stakedBalance)} />}
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col xs={4}>
              <Stat
                mt="24px"
                label="Utilized"
                align="center"
                value={<Dai value={format(totalLockedStake)} />}
                after={
                  <Bar
                    label={`${lockedPercentage}%`}
                    percentage={lockedPercentage}
                  />
                }
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <Stat
                mt="24px"
                align="center"
                label="Withdrawable"
                value={
                  <Dai value={format(stakedBalance.sub(totalLockedStake))} />
                }
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <Stat
                mt="24px"
                align="center"
                label="Defaulted"
                value={<Dai value={format(defaulted)} />}
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col xs={6}>
              <Button mt="24px" label="Deposit DAI" onClick={() => alert()} />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Button
                mt="24px"
                label="Withdraw DAI"
                variant="secondary"
                onClick={() => alert()}
              />
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Card.Body>
    </Card>
  );
}
