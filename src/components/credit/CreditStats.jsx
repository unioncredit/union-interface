import { useBlockNumber, useNetwork, mainnet } from "wagmi";
import { Stat, Button, Grid, Card, Label, Tooltip, Dai } from "@unioncredit/ui";
import { ReactComponent as TooltipIcon } from "@unioncredit/ui/lib/icons/wireInfo.svg";

import { ZERO } from "constants";
import format from "utils/format";
import dueDate, { NoPaymentLabel } from "utils/dueDate";
import { reduceBnSum } from "utils/reduce";
import { useMember } from "providers/MemberData";
import { useVouchers } from "providers/VouchersData";
import { useProtocol } from "providers/ProtocolData";
import { REPAY_MODAL } from "components/modals/RepayModal";
import { useModals } from "providers/ModalManager";
import { BORROW_MODAL } from "components/modals/BorrowModal";
import { PAYMENT_REMINDER_MODAL } from "components/modals/PaymentReminderModal";

export default function CreditStats() {
  const { open } = useModals();
  const { chain: connectedChain } = useNetwork();

  const { data: member = {} } = useMember();
  const { data: vouchers = [] } = useVouchers();
  const { data: protocol = {} } = useProtocol();
  const { data: blockNumber } = useBlockNumber({
    chainId: mainnet.id,
  });

  const {
    creditLimit = ZERO,
    minPayment = ZERO,
    owed = ZERO,
    lastRepay = ZERO,
    overdueBlocks = ZERO,
  } = { ...member, ...protocol };

  const vouch = vouchers.map(({ vouch }) => vouch).reduce(reduceBnSum, ZERO);

  const dueDateDisplay = dueDate(
    lastRepay,
    overdueBlocks,
    blockNumber,
    connectedChain.id
  );

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
                value={<Dai value={format(creditLimit, 2, false)} />}
              />
              <Stat
                mt="24px"
                align="center"
                label="Vouch"
                value={<Dai value={format(vouch)} />}
                after={
                  <Label m={0}>
                    {format(vouch.sub(creditLimit))} DAI unavailable
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
                value={<Dai value={format(minPayment)} />}
                after={
                  <Label
                    size="small"
                    className="label--clickable"
                    color={
                      dueDateDisplay === NoPaymentLabel ? "grey500" : "blue500"
                    }
                    onClick={() =>
                      dueDateDisplay !== NoPaymentLabel &&
                      open(PAYMENT_REMINDER_MODAL)
                    }
                  >
                    {dueDateDisplay}
                  </Label>
                }
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col xs={6}>
              <Button
                mt="28px"
                label="Borrow funds"
                disabled={creditLimit.lte(ZERO)}
                onClick={() => open(BORROW_MODAL)}
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Button
                mt="28px"
                variant="secondary"
                label="Make a payment"
                disabled={owed.lte(ZERO)}
                onClick={() => open(REPAY_MODAL)}
              />
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Card.Body>
    </Card>
  );
}
