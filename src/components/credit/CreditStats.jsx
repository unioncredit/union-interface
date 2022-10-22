import { useBlockNumber, useNetwork } from "wagmi";
import { Stat, Button, Grid, Card, Label, Tooltip, Dai } from "@unioncredit/ui";
import { ReactComponent as TooltipIcon } from "@unioncredit/ui/lib/icons/tooltip.svg";

import { ZERO } from "constants";
import format from "utils/format";
import { reduceBnSum } from "utils/reduce";
import { useMember } from "providers/MemberData";
import { useVouchers } from "providers/VouchersData";
import { useProtocol } from "providers/ProtocolData";
import dueDate from "utils/dueDate";

export default function CreditStats() {
  const { chain } = useNetwork();
  const { data: member } = useMember();
  const { data: vouchers = {} } = useVouchers();
  const { data: blockNumber } = useBlockNumber();
  const { data: protocol } = useProtocol();

  const {
    creditLimit = ZERO,
    interest = ZERO,
    owed = ZERO,
    lastRepay = ZERO,
  } = member;

  const vouch = vouchers.map(({ vouch }) => vouch).reduce(reduceBnSum, ZERO);
  const locked = vouchers.map(({ locked }) => locked).reduce(reduceBnSum, ZERO);

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
                value={<Dai value={format(creditLimit)} />}
              />
              <Stat
                mt="24px"
                align="center"
                label="Vouch"
                value={<Dai value={format(vouch)} />}
                after={
                  <Label m={0}>
                    {format(locked)} DAI unavailable
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
                value={<Dai value={format(owed)} />}
              />

              <Stat
                align="center"
                label="Minimum due"
                mt="24px"
                mb="4.5px"
                value={<Dai value={format(interest)} />}
                after={
                  <Label size="small" color="blue500" onClick={() => alert()}>
                    {dueDate(
                      lastRepay,
                      protocol.overdueBlocks || ZERO,
                      blockNumber,
                      chain.id
                    )}
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
