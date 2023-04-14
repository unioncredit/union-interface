import {
  Box,
  Button,
  Dai,
  Grid,
  Input,
  Modal,
  ModalOverlay,
  NumericalBlock,
  BorrowIcon,
  NumericalRows,
} from "@unioncredit/ui";
import { useNetwork } from "wagmi";

import format from "utils/format";
import useForm from "hooks/useForm";
import useWrite from "hooks/useWrite";
import useFirstPaymentDueDate from "hooks/useFirstPaymentDueDate";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import { ZERO, Errors, WAD } from "constants";
import { useProtocol } from "providers/ProtocolData";
import {
  calculateExpectedMinimumPayment,
  calculateInterestRate,
} from "utils/numbers";

export const BORROW_MODAL = "borrow-modal";

export default function BorrowModal() {
  const { chain } = useNetwork();
  const { close } = useModals();
  const { data: member, refetch: refetchMember } = useMember();
  const { data: protocol } = useProtocol();
  const firstPaymentDueDate = useFirstPaymentDueDate();

  const {
    owed = ZERO,
    minBorrow = ZERO,
    creditLimit = ZERO,
    originationFee = ZERO,
    overdueBlocks = ZERO,
    borrowRatePerBlock = ZERO,
  } = { ...member, ...protocol };

  const validate = (inputs) => {
    if (member.isOverdue) {
      return Errors.IS_OVERDUE;
    } else if (inputs.amount.raw.gt(creditLimit)) {
      return Errors.INSUFFICIENT_CREDIT_LIMIT;
    } else if (inputs.amount.raw.lt(minBorrow)) {
      return Errors.MIN_BORROW(minBorrow);
    }
  };

  const { register, values = {}, errors = {}, empty } = useForm({ validate });

  const amount = values.amount || empty;

  const fee = amount.raw.mul(originationFee).div(WAD);

  const borrow = amount.raw.add(fee);

  const newOwed = borrow.add(owed);

  const minPayment = calculateExpectedMinimumPayment(
    borrow,
    borrowRatePerBlock,
    overdueBlocks
  );

  const buttonProps = useWrite({
    contract: "uToken",
    method: "borrow",
    args: [amount.raw],
    enabled: amount.raw.gt(ZERO) && !errors.amount,
    onComplete: async () => {
      await refetchMember();
      close();
    },
  });

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="BorrowModal">
        <Modal.Header title="Borrow DAI" onClose={close} />
        <Modal.Body>
          {/*--------------------------------------------------------------
            Stats Before 
          *--------------------------------------------------------------*/}
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <NumericalBlock
                  token="dai"
                  size="regular"
                  title="Available to borrow"
                  value={format(creditLimit, 2, false)}
                />
              </Grid.Col>
              <Grid.Col>
                <NumericalBlock
                  token="dai"
                  size="regular"
                  title="Balance owed"
                  value={format(owed)}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
          {/*--------------------------------------------------------------
            Input 
          *--------------------------------------------------------------*/}
          <Box mt="24px">
            <Input
              type="number"
              name="amount"
              label="Amount to borrow"
              suffix={<Dai />}
              placeholder="0.0"
              error={errors.amount}
              value={amount.display}
              onChange={register("amount")}
            />
          </Box>
          {/*--------------------------------------------------------------
            Stats After 
          *--------------------------------------------------------------*/}
          <NumericalRows
            mt="16px"
            items={[
              {
                label: "Interest rate",
                value: `${format(
                  calculateInterestRate(borrowRatePerBlock, chain.id).mul(100)
                )}% APR`,
                tooltip: {
                  content: "TODO",
                  position: "right",
                  shrink: true,
                },
              },
              {
                label: "Total incl. origination fee",
                value: `${format(borrow)} DAI`,
                tooltip: {
                  content: "TODO",
                  position: "right",
                  shrink: true,
                },
              },
              {
                label: "New balance owed",
                value: `${format(newOwed)} DAI`,
                tooltip: {
                  content: "TODO",
                  position: "right",
                  shrink: true,
                },
              },
              {
                label: "Payment due",
                value: `${format(minPayment)} DAI · ${firstPaymentDueDate}`,
                tooltip: {
                  content: "TODO",
                  position: "right",
                  shrink: true,
                },
              },
            ]}
          />
          {/*--------------------------------------------------------------
            Button 
          *--------------------------------------------------------------*/}
          <Button
            fluid
            mt="16px"
            size="large"
            icon={BorrowIcon}
            label={`Borrow ${amount.display} DAI`}
            disabled={amount.raw.lte(ZERO)}
            {...buttonProps}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
