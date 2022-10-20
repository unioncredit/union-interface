import {
  Stat,
  Button,
  Grid,
  Card,
  Label,
  Tooltip,
  Dai,
  Bar,
} from "@unioncredit/ui";
import { ReactComponent as TooltipIcon } from "@unioncredit/ui/lib/icons/tooltip.svg";

export default function StakeStats() {
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
                value={<Dai value={0} />}
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col xs={4}>
              <Stat
                mt="24px"
                label="Utilized"
                align="center"
                value={<Dai value={0} />}
                after={<Bar label="0%" percentage={0} />}
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <Stat
                mt="24px"
                align="center"
                label="Withdrawable"
                value={<Dai value={0} />}
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <Stat
                mt="24px"
                align="center"
                label="Defaulted"
                value={<Dai value={0} />}
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
