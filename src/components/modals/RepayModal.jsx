import "./Repaymodal.scss";

import { useAccount } from "wagmi";
import {
  Box,
  Text,
  Dai,
  Grid,
  Input,
  Modal,
  ModalOverlay,
  NumericalBlock,
  OptionSelect,
  NumericalRows,
  Button,
  EditIcon,
  Divider,
  ListIcon,
} from "@unioncredit/ui";

import useForm from "hooks/useForm";
import { Approval } from "components/shared";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import useContract from "hooks/useContract";
import { ZERO } from "constants";
import format from "utils/format";
import { useEffect, useState } from "react";
import { Errors } from "constants";
import { useVersion, Versions } from "providers/Version";

export const REPAY_MODAL = "repay-modal";

const PaymentType = {
  MIN: "min",
  MAX: "max",
  CUSTOM: "custom",
};

export default function RepayModal() {
  const { close } = useModals();
  const { address } = useAccount();
  const { version } = useVersion();
  const { data: member } = useMember();
  const [paymentType, setPaymentType] = useState(null);

  const uTokenContract = useContract("uToken");

  const { owed = ZERO, daiBalance = ZERO, minPayment = ZERO } = member;

  const validate = (inputs) => {
    if (inputs.amount.raw.gt(daiBalance)) {
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
  const newOwed = owed.sub(amount.raw);
  const isCustomSelected = paymentType === PaymentType.CUSTOM;

  // Factor in a 0.01% margin for the max repay as we can no longer use MaxUint256
  const owedBalanceWithMargin = owed.add(owed.div(1000));

  // The maximum amount the user can repay, either their total DAI balance
  // or their balance owed + 0.01% margin
  const maxRepay = daiBalance.gte(owedBalanceWithMargin)
    ? owedBalanceWithMargin
    : daiBalance;

  const options = [
    {
      token: "dai",
      value: format(maxRepay),
      amount: maxRepay,
      paymentType: PaymentType.MAX,
      title: maxRepay.gte(owed)
        ? "Pay-off entire loan"
        : "Pay maximum DAI available",
      content: maxRepay.gte(owed)
        ? "Make a payment equal to the outstanding balance"
        : "Make a payment with the maximum amount available in your wallet",
    },
    {
      value: format(minPayment),
      amount: minPayment,
      token: "dai",
      paymentType: PaymentType.MIN,
      title: "Pay minimum due",
      content:
        "Make the payment required to cover the interest due on your loan",
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
                  token="dai"
                  size="regular"
                  title="Balance owed"
                  value={format(owed)}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <NumericalBlock
                  mb="16px"
                  token="dai"
                  size="regular"
                  title="Due today"
                  value={format(minPayment)}
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
                rightLabel={`Max. ${format(daiBalance)}`}
                suffix={<Dai />}
                placeholder="0.0"
                error={isCustomSelected ? errors.amount : null}
                onChange={register("amount")}
              />
            </Box>
          ) : (
            <OptionSelect
              cards={options}
              onChange={(index) => handleSelect(options[index])}
            />
          )}

          <Button
            fluid
            mt="8px"
            size="small"
            icon={paymentType === PaymentType.CUSTOM ? ListIcon : EditIcon}
            color="secondary"
            variant="light"
            label={
              paymentType === PaymentType.CUSTOM
                ? "Select a preset amount"
                : "Enter custom amount"
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
                value: `${format(daiBalance)} DAI`,
                error: errors.amount === Errors.INSUFFICIENT_BALANCE,
                tooltip: {
                  content: "How much DAI you have in your connected wallet",
                },
              },
              {
                label: "Next payment due",
                value: `${format(minPayment)} DAI`,
              },
              {
                label: "New balance owed",
                value: `${format(newOwed.lt(ZERO) ? ZERO : newOwed)} DAI`,
                tooltip: {
                  content: "The total amount you will owe if this payment transaction is successful",
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
            tokenContract="dai"
            actionProps={{
              args:
                version === Versions.V1 ? [amount.raw] : [address, amount.raw],
              permitArgs: [address, amount.raw],
              enabled: !isErrored,
              contract: "uToken",
              method: "repayBorrow",
              label: `Repay ${amount.display} DAI`,
            }}
            approvalLabel="Approve Union to spend your DAI"
            approvalCompleteLabel="You can now repay"
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
