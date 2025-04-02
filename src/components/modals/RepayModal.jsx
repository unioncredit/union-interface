import "./Repaymodal.scss";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  EditIcon,
  Grid,
  Input,
  ListIcon,
  Modal,
  ModalOverlay,
  NumericalBlock,
  NumericalRows,
  OptionSelect,
  Text,
} from "@unioncredit/ui";

import useForm from "hooks/useForm";
import { Approval } from "components/shared";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import useContract from "hooks/useContract";
import { Errors, ZERO } from "constants";
import format from "utils/format";
import { useVersion, Versions } from "providers/Version";
import Token from "components/Token";
import { useToken } from "hooks/useToken";

export const REPAY_MODAL = "repay-modal";

const PaymentType = {
  MIN: "min",
  MAX: "max",
  CUSTOM: "custom",
};

export default function RepayModal() {
  const [paymentType, setPaymentType] = useState(null);

  const { close } = useModals();
  const { address } = useAccount();
  const { version } = useVersion();
  const { data: member } = useMember();
  const { token, unit } = useToken();

  const uTokenContract = useContract("uToken");

  const { owed = ZERO, tokenBalance = ZERO, minPayment = ZERO } = member;

  const validate = (inputs) => {
    if (inputs.amount.raw > tokenBalance) {
      return Errors.INSUFFICIENT_BALANCE;
    }
  };

  const {
    register,
    values = {},
    errors = {},
    empty,
    setRawValue,
    isErrored,
  } = useForm({ validate });

  const handleSelect = (option) => {
    setPaymentType(option.paymentType);
    setRawValue("amount", option.amount);
  };

  const amount = values.amount || empty;
  const newOwed = owed - amount.raw;
  const isCustomSelected = paymentType === PaymentType.CUSTOM;

  // Factor in a 0.005% margin for the max repay as we can no longer use MaxUint256.
  // If 0.005% of the balance owed is less than 0.01 we default to 0.01
  const margin = owed / 50000n;
  const minMargin = BigInt((10 ** unit / 100).toString());
  const owedBalanceWithMargin = owed + (margin < minMargin ? minMargin : margin);
  // The maximum amount the user can repay, either their total token balance
  // or their balance owed + 0.005% margin
  const maxRepay = tokenBalance >= owedBalanceWithMargin ? owedBalanceWithMargin : tokenBalance;
  const options = [
    {
      token: token.toLowerCase(),
      value: format(maxRepay, token),
      amount: maxRepay,
      paymentType: PaymentType.MAX,
      title: maxRepay >= owed ? "Pay-off entire loan" : `Pay maximum ${token} available`,
      content:
        maxRepay >= owed
          ? "Make a payment equal to the outstanding balance"
          : "Make a payment with the maximum amount available in your wallet",
      tooltip: maxRepay >= owed &&
        format(maxRepay, token) !== format(owed, token) && {
          title: "Why is this more than my balance owed?",
          content:
            "As interest increases per block, when paying off the entire loan we factor in a small margin to ensure the transaction succeeds.",
          position: "right",
        },
    },
    {
      value: format(minPayment, token),
      amount: minPayment,
      token: token.toLowerCase(),
      paymentType: PaymentType.MIN,
      title: "Pay minimum due",
      content: "Make the payment required to cover the interest due on your loan",
    },
  ];

  useEffect(() => {
    handleSelect(options[0]);
  }, []);

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="RepayModal">
        <Modal.Header title="Make a payment" onClose={close} />
        <Modal.Body>
          {/*--------------------------------------------------------------
            Stats Before 
          *--------------------------------------------------------------*/}
          <Grid>
            <Grid.Row>
              <Grid.Col xs={6}>
                <NumericalBlock
                  mb="16px"
                  token={token.toLowerCase()}
                  size="regular"
                  title="Balance owed"
                  value={format(owed, token)}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <NumericalBlock
                  mb="16px"
                  token={token.toLowerCase()}
                  size="regular"
                  title="Due today"
                  value={format(minPayment, token)}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>

          {/*--------------------------------------------------------------
            Options
          *--------------------------------------------------------------*/}
          {paymentType === PaymentType.CUSTOM ? (
            <Box className="RepayModal__custom" direction="vertical">
              <Text m={0} grey={800} size="medium" weight="medium">
                Custom payment amount
              </Text>
              <Text m={0} grey={600}>
                Enter a custom amount to repay
              </Text>
              <Divider m="8px 0" />
              <Input
                type="number"
                name="amount"
                label="Amount to repay"
                rightLabel={`Max. ${format(maxRepay, token)}`}
                rightLabelAction={() => setRawValue("amount", maxRepay, false)}
                suffix={<Token />}
                placeholder="0.0"
                value={amount.raw !== ZERO ? amount.formatted : ""}
                error={isCustomSelected ? errors.amount : null}
                onChange={register("amount")}
              />
            </Box>
          ) : (
            <OptionSelect cards={options} onChange={(index) => handleSelect(options[index])} />
          )}

          <Button
            fluid
            mt="8px"
            size="small"
            icon={paymentType === PaymentType.CUSTOM ? ListIcon : EditIcon}
            color="secondary"
            variant="light"
            label={
              paymentType === PaymentType.CUSTOM ? "Select a preset amount" : "Enter custom amount"
            }
            onClick={() => {
              handleSelect(
                paymentType === PaymentType.CUSTOM
                  ? options[0]
                  : {
                      paymentType: PaymentType.CUSTOM,
                      amount: ZERO,
                    }
              );
            }}
          />

          {/*--------------------------------------------------------------
            Stats After 
          *--------------------------------------------------------------*/}
          <NumericalRows
            m="24px 0"
            items={[
              {
                label: "Wallet balance",
                value: `${format(tokenBalance, token)} ${token}`,
                error: errors.amount === Errors.INSUFFICIENT_BALANCE,
                tooltip: {
                  content: `How much ${token} you have in your connected wallet`,
                },
              },
              {
                label: "Next payment due",
                value: `${format(minPayment, token)} ${token}`,
              },
              {
                label: "New balance owed",
                value: `${format(newOwed < ZERO ? ZERO : newOwed, token)} ${token}`,
                tooltip: {
                  content:
                    "The total amount you will owe if this payment transaction is successful",
                },
              },
            ]}
          />
          {/*--------------------------------------------------------------
            Button
          *--------------------------------------------------------------*/}
          <Approval
            owner={address}
            amount={amount.raw}
            spender={uTokenContract.address}
            requireApproval
            tokenContract={token.toLowerCase()}
            actionProps={{
              args: version === Versions.V1 ? [amount.raw] : [address, amount.raw],
              permitArgs: [address, amount.raw],
              enabled: !isErrored,
              contract: "uToken",
              method: "repayBorrow",
              label: `Repay ${amount.display} ${token}`,
            }}
            approvalLabel={`Approve Union to spend your ${token}`}
            approvalCompleteLabel="You can now repay"
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
