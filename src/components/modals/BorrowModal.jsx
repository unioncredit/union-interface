import {
  BorrowIcon,
  Box,
  Button,
  Grid,
  Input,
  Modal,
  ModalOverlay,
  NumericalBlock,
  NumericalRows,
} from "@unioncredit/ui";
import { useAccount } from "wagmi";
import format from "utils/format";
import useForm from "hooks/useForm";
import useWrite from "hooks/useWrite";
import useFirstPaymentDueDate from "hooks/useFirstPaymentDueDate";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import { Errors, ZERO } from "constants";
import { useProtocol } from "providers/ProtocolData";
import { useToken } from "hooks/useToken";
import {
  calculateExpectedMinimumPayment,
  calculateInterestRate,
  calculateMaxBorrow,
} from "utils/numbers";
import Token from "components/Token";

export const BORROW_MODAL = "borrow-modal";

export default function BorrowModal() {
  const { close } = useModals();
  const { chain, address } = useAccount();
  const { data: member, refetch: refetchMember } = useMember();
  const { data: protocol } = useProtocol();
  const { token, unit } = useToken();
  const firstPaymentDueDate = useFirstPaymentDueDate();

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

  const borrowRatePerUnit = borrowRatePerSecond === ZERO ? borrowRatePerBlock : borrowRatePerSecond;

  const validate = (inputs) => {
    if (member.isOverdue) {
      return Errors.IS_OVERDUE;
    } else if (inputs.amount.raw > creditLimit) {
      return Errors.INSUFFICIENT_CREDIT_LIMIT;
    } else if (inputs.amount.raw < minBorrow) {
      return Errors.MIN_BORROW(minBorrow, token);
    } else if (inputs.amount.raw > getLoanableAmount) {
      return Errors.INSUFFICIENT_FUNDS;
    }
  };

  const { register, setRawValue, values = {}, errors = {}, empty } = useForm({ validate });

  const amount = values.amount || empty;

  const maxBorrow = calculateMaxBorrow(creditLimit, originationFee);

  const fee = (amount.raw * originationFee) / BigInt("1000000000000000000");

  const borrow = amount.raw + fee;

  const newOwed = borrow + owed;

  const minPayment = calculateExpectedMinimumPayment(newOwed, borrowRatePerUnit, overdueTime, unit);

  const buttonProps = useWrite({
    contract: "uToken",
    method: "borrow",
    args: [address, amount.raw],
    enabled: amount.raw > ZERO && !errors.amount,
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
        <Modal.Header title={`Borrow ${token}`} onClose={close} />
        <Modal.Body>
          {/*--------------------------------------------------------------
            Stats Before 
          *--------------------------------------------------------------*/}
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <NumericalBlock
                  token={token.toLowerCase()}
                  size="regular"
                  title="Available to borrow"
                  value={format(creditLimit, token, 2, false)}
                />
              </Grid.Col>
              <Grid.Col>
                <NumericalBlock
                  token={token.toLowerCase()}
                  size="regular"
                  title="Balance owed"
                  value={format(owed, token)}
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
              rightLabel={`Max. ${format(maxBorrow, token)} ${token}`}
              rightLabelAction={() => setRawValue("amount", maxBorrow, false)}
              suffix={<Token />}
              placeholder="0.0"
              error={errors.amount}
              value={amount.formatted}
              onChange={register("amount", (value) => !isNaN(value) && value > 0)}
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
                  calculateInterestRate(borrowRatePerUnit, chain.id, unit) * 100n,
                  token
                )}% APR`,
                tooltip: {
                  content: "The interest rate accrued over a 12 month borrow period",
                },
              },
              {
                label: "Total incl. origination fee",
                value: `${format(borrow, token)} ${token}`,
                tooltip: {
                  content: "Total amount borrowed including fee",
                },
              },
              {
                label: "New balance owed",
                value: `${format(newOwed, token)} ${token}`,
                tooltip: {
                  content: "The total amount you will owe if this borrow transaction is successful",
                },
              },
              {
                label: "Payment due",
                value:
                  amount.raw <= 0n && owed <= 0n
                    ? "N/A"
                    : `${format(minPayment, token)} ${token} · ${firstPaymentDueDate}`,
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
            label={`Borrow ${amount.display} ${token}`}
            disabled={amount.raw <= ZERO}
            {...buttonProps}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
