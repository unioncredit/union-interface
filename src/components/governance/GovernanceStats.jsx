import { Stat, Button, Grid, Card, Dai, Bar } from "@unioncredit/ui";
import { ReactComponent as External } from "@unioncredit/ui/lib/icons/externalinline.svg";
import { useProtocol } from "providers/ProtocolData";

import format from "utils/format";

export default function GovernaceStats() {
  const { data: protocol } = useProtocol();

  const { totalStaked = ZERO } = protocol;

  return (
    <Card>
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
                value={<Dai value={format(0)} />}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Stat
                mt="32px"
                align="center"
                label="Outstanding loans"
                value={<Dai value={format(0)} />}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Stat
                mt="32px"
                align="center"
                label="Interest rate"
                value={format(0)}
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col>
              <Button
                fluid
                as="a"
                href="#"
                target="_blank"
                mt="32px"
                variant="secondary"
                label="Dune Analytics"
                icon={External}
                iconPosition="end"
              />
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Card.Body>
    </Card>
  );
}
