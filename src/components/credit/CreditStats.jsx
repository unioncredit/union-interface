import { Stat, Button, Grid, Card, Label, Tooltip, Dai } from "@unioncredit/ui";
import { ReactComponent as TooltipIcon } from "@unioncredit/ui/lib/icons/tooltip.svg";

export default function CreditStats() {
  return (
    <Card>
      <Card.Header title="Borrow & Repay" align="center" />
      <Card.Body>
        <Grid divider>
          <Grid.Row>
            <Grid.Col xs={6}>
              <Stat
                size="large"
                align="center"
                label="Available credit"
                value={<Dai value={0} />}
              />
              <Stat
                mt="24px"
                align="center"
                label="Vouch"
                value={<Dai value={0} />}
                after={
                  <Label m={0}>
                    {0} DAI unavailable
                    <Tooltip content="These are funds which are currently tied up elsewhere and as a result, not available to borrow at this time">
                      <TooltipIcon width="16px" />
                    </Tooltip>
                  </Label>
                }
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Stat
                size="large"
                align="center"
                label="Balance owed"
                value={<Dai value={0} />}
              />

              <Stat
                align="center"
                label="Minimum due"
                mt="24px"
                mb="4.5px"
                value={<Dai value={0} />}
                after={
                  <Label size="small" color="blue500" onClick={() => alert()}>
                    Due dates
                  </Label>
                }
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col xs={6}>
              <Button
                label="Make a payment"
                onClick={() => alert()}
                variant="secondary"
                mt="28px"
                disabled={false}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Button mt="28px" label="Borrow funds" onClick={() => alert()} />
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Card.Body>
    </Card>
  );
}
