import {
  Box,
  Button,
  Dai,
  Usdc,
  Grid,
  Input,
  Modal,
  ModalOverlay,
  NumericalBlock,
  BorrowIcon,
  NumericalRows,
} from "@unioncredit/ui";
import { useAccount, useNetwork } from "wagmi";

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
  calculateMaxBorrow,
} from "utils/numbers";
import { useSettings } from "providers/Settings";

export const BORROW_MODAL = "borrow-modal";

export default function BorrowModal() {
  const { chain } = useNetwork();
  const { close } = useModals();
  const { address } = useAccount();
  const { data: member, refetch: refetchMember } = useMember();
  const { data: protocol } = useProtocol();
  const firstPaymentDueDate = useFirstPaymentDueDate();
  const {
    settings: { useToken },
  } = useSettings();

  const {
    owed = ZERO,
    minBorrow = ZERO,
    creditLimit = ZERO,
    originationFee = ZERO,
    overdueTime = ZERO,
    borrowRatePerBlock = ZERO,
    borrowRatePerSecond = ZERO,
    getLoanableAmount = ZERO,
  } = { ...member, ...protocol };

  const borrowRatePerUnit = borrowRatePerSecond.eq(ZERO) ? borrowRatePerBlock : borrowRatePerSecond;

  const validate = (inputs) => {
    if (member.isOverdue) {
      return Errors.IS_OVERDUE;
    } else if (inputs.amount.raw.gt(creditLimit)) {
      return Errors.INSUFFICIENT_CREDIT_LIMIT;
    } else if (inputs.amount.raw.lt(minBorrow)) {
      return Errors.MIN_BORROW(minBorrow);
    } else if (inputs.amount.raw.gt(getLoanableAmount)) {
      return Errors.INSUFFICIENT_FUNDS;
    }
  };

  const { register, setRawValue, values = {}, errors = {}, empty } = useForm({ validate });

  const amount = values.amount || empty;

  const maxBorrow = calculateMaxBorrow(creditLimit, originationFee);

  const fee = amount.raw.mul(originationFee).div(WAD);

  const borrow = amount.raw.add(fee);

  const newOwed = borrow.add(owed);

  const minPayment = calculateExpectedMinimumPayment(borrow, borrowRatePerBlock, overdueTime);

  const buttonProps = useWrite({
    contract: "uToken",
    method: "borrow",
    args: [address, amount.raw],
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
        <Modal.Header title={`Borrow ${useToken}`} onClose={close} />
        <Modal.Body>
          {/*--------------------------------------------------------------
            Stats Before 
          *--------------------------------------------------------------*/}
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <NumericalBlock
                  token={useToken.toLowerCase()}
                  size="regular"
                  title="Available to borrow"
                  value={format(creditLimit, 2, false)}
                />
              </Grid.Col>
              <Grid.Col>
                <NumericalBlock
                  token={useToken.toLowerCase()}
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
              rightLabel={`Max. ${format(maxBorrow)} ${useToken}`}
              rightLabelAction={() => setRawValue("amount", maxBorrow, false)}
              suffix={useToken == "USDC" ? <Usdc /> : <Dai />}
              placeholder="0.0"
              error={errors.amount}
              value={amount.formatted}
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
                  calculateInterestRate(borrowRatePerUnit, chain.id).mul(100)
                )}% APR`,
                tooltip: {
                  content: "The interest rate accrued over a 12 month borrow period",
                },
              },
              {
                label: "Total incl. origination fee",
                value: `${format(borrow)} ${useToken}`,
                tooltip: {
                  content: "Total amount borrowed including fee",
                },
              },
              {
                label: "New balance owed",
                value: `${format(newOwed)} ${useToken}`,
                tooltip: {
                  content: "The total amount you will owe if this borrow transaction is successful",
                },
              },
              {
                label: "Payment due",
                value:
                  amount.raw.lte(0) && owed.lte(0)
                    ? "N/A"
                    : `${format(minPayment)} ${useToken} · ${firstPaymentDueDate}`,
                tooltip: {
                  content:
                    "The amount and date of your next minimum payment in order to not enter a default state",
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
            label={`Borrow ${amount.display} ${useToken}`}
            disabled={amount.raw.lte(ZERO)}
            {...buttonProps}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
