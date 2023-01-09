import { useAccount } from "wagmi";
import {
  Badge,
  Box,
  Card,
  Collapse,
  Control,
  Dai,
  Grid,
  Input,
  Label,
  Modal,
  ModalOverlay,
  Stat,
} from "@unioncredit/ui";

import useForm from "hooks/useForm";
import Approval from "components/shared/Approval";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import useContract from "hooks/useContract";
import { ZERO } from "constants";
import format from "utils/format";
import { useState } from "react";
import { Errors } from "constants";
import { ethers } from "ethers";

export const REPAY_MODAL = "repay-modal";

const PaymentType = {
  MIN: "min",
  MAX: "max",
  CUSTOM: "custom",
};

export default function RepayModal() {
  const { close } = useModals();
  const { address } = useAccount();
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

  const handleSelectOption = (option) => () => {
    setPaymentType(option.paymentType);
    setRawValue("amount", option.value);
  };

  const maxRepay = daiBalance.gte(owed) ? owed : daiBalance;

  const amount = values.amount || empty;

  const isCustomSelected = paymentType === PaymentType.CUSTOM;

  let newOwed = owed.sub(amount.raw);
  newOwed = newOwed.lt(ZERO) ? ZERO : newOwed;

  const displayAmount = amount.raw.eq(ethers.constants.MaxUint256)
    ? format(maxRepay)
    : amount.display;

  const options = [
    {
      value: minPayment,
      display: format(minPayment),
      paymentType: PaymentType.MIN,
      title: "Pay minimum due",
      content:
        "Make the payment required to cover the interest due on your loan",
    },
    {
      display: format(daiBalance.lt(owed) ? daiBalance : owed),
      value: daiBalance.lt(owed) ? daiBalance : ethers.constants.MaxUint256,
      paymentType: PaymentType.MAX,
      title: maxRepay.gte(owed)
        ? "Pay-off entire loan"
        : "Pay maximum DAI available",
      content: maxRepay.gte(owed)
        ? "Make a payment to pay-off your current balance owed in its entirety"
        : "Make a payment with the maximum amount of DAI available in your connected wallet",
    },
  ];

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="RepayModal">
        <Modal.Header title="Repay loan" onClose={close} />
        <Modal.Body>
          {/*--------------------------------------------------------------
            Stats Before 
          *--------------------------------------------------------------*/}
          <Grid>
            <Grid.Row>
              <Grid.Col xs={6}>
                <Stat
                  mb="16px"
                  align="center"
                  size="medium"
                  label="Balance owed"
                  value={<Dai value={format(owed)} />}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <Stat
                  mb="16px"
                  align="center"
                  size="medium"
                  label="Dai in Wallet"
                  value={<Dai value={format(daiBalance)} />}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
          {/*--------------------------------------------------------------
            Options
          *--------------------------------------------------------------*/}
          {options.map((option) => {
            const selected = option.paymentType === paymentType;

            return (
              <Card
                key={option.paymentType}
                variant={selected ? "blue" : "primary"}
                bordered={selected}
                packed
                mt="8px"
              >
                <Card.Body>
                  <Box justify="space-between">
                    <Box direction="vertical">
                      <Control
                        onClick={handleSelectOption(option)}
                        label={option.title}
                        type="radio"
                        checked={selected}
                      />
                      <Collapse active={selected}>
                        <Label as="p" mt="4px" mb={0}>
                          {option.content}
                        </Label>
                      </Collapse>
                    </Box>
                    {option.value && (
                      <Badge
                        ml="8px"
                        color={selected ? "blue" : "grey"}
                        label={<Dai value={option.display} />}
                      />
                    )}
                  </Box>
                </Card.Body>
              </Card>
            );
          })}
          {/*--------------------------------------------------------------
            Custom Amount
          *--------------------------------------------------------------*/}
          <Card
            packed
            mt="8px"
            mb="24px"
            variant={isCustomSelected ? "blue" : "primary"}
          >
            <Card.Body>
              <Box align="center">
                <Box direction="vertical" fluid>
                  <Control
                    checked={isCustomSelected}
                    type="radio"
                    label="Custom payment amount"
                    onClick={handleSelectOption({
                      paymentType: PaymentType.CUSTOM,
                      value: ZERO,
                    })}
                  />
                  <Collapse active={isCustomSelected}>
                    <Box fluid mt="12px">
                      <Input
                        type="number"
                        name="amount"
                        suffix={<Dai />}
                        placeholder="0.0"
                        error={isCustomSelected ? errors.amount : null}
                        onChange={register("amount")}
                      />
                    </Box>
                  </Collapse>
                </Box>
              </Box>
            </Card.Body>
          </Card>
          {/*--------------------------------------------------------------
            Stats After 
          *--------------------------------------------------------------*/}
          <Box justify="space-between" mt="24px" mb="18px">
            <Label as="p" grey={400}>
              New balance owed
            </Label>
            <Label as="p" grey={400} m={0}>
              {format(newOwed)} DAI
            </Label>
          </Box>
          {/*--------------------------------------------------------------
            Button
          *--------------------------------------------------------------*/}
          <Approval
            owner={address}
            amount={amount.raw}
            spender={uTokenContract.addressOrName}
            requireApproval
            tokenContract="dai"
            actionProps={{
              args: [amount.raw],
              enabled: !isErrored,
              contract: "uToken",
              method: "repayBorrow",
              label: `Repay ${displayAmount} DAI`,
            }}
            approvalLabel="Approve Union to spend your DAI"
            approvalCompleteLabel="You can now stake your DAI"
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
