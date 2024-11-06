import {
  Button,
  Dai,
  Input,
  Text,
  Modal,
  ModalOverlay,
  NumericalBlock,
  NumericalRows,
  WarningIcon,
  ExpandingInfo,
} from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import { ZERO } from "constants";
import format from "utils/format";
import useForm from "hooks/useForm";
import useWrite from "hooks/useWrite";
import { AddressSummary } from "components/shared";
import { useMember, useMemberData } from "../../providers/MemberData";
import React from "react";
import { useAccount } from "wagmi";

export const PUBLIC_WRITE_OFF_DEBT_MODAL = "public-write-off-debt-modal";

export default function PublicWriteOffDebtModal({ address }) {
  const { close } = useModals();
  const { address: connectedAddress } = useAccount();

  const { data: contact } = useMemberData(address);
  const { data: member } = useMember();

  const { owed = ZERO, isOverdue } = contact;
  const { daiBalance = ZERO } = member;

  const validate = (inputs) => {
    if (inputs.amount?.raw.gt(owed)) {
      return "Amount exceeds defaulted value";
    }
  };

  const { register, setRawValue, errors = {}, values = {}, empty } = useForm({ validate });

  const amount = values.amount || empty;

  const buttonProps = useWrite({
    contract: "userManager",
    method: "debtWriteOff",
    args: [connectedAddress, address, amount.raw],
    enabled: isOverdue && address && amount.raw.gt(ZERO),
    onComplete: async () => {
      window.location.reload();
    },
  });

  return (
    <ModalOverlay onClick={close}>
      <Modal className="WriteOffDebt">
        <Modal.Header onClose={close} noHeight>
          <AddressSummary m={0} address={address} />
        </Modal.Header>
        <Modal.Body>
          <Modal.Container direction="vertical">
            <NumericalBlock
              align="left"
              token="dai"
              title="Amount in default"
              value={format(owed)}
            />

            <Input
              mt="16px"
              type="number"
              name="amount"
              label="Amount to write-off"
              error={errors.amount}
              value={amount.display}
              onChange={register("amount")}
              rightLabel={`Max. ${format(daiBalance.gte(owed) ? owed : daiBalance)} DAI`}
              rightLabelAction={() =>
                setRawValue("amount", daiBalance.gte(owed) ? owed : daiBalance, false)
              }
              suffix={<Dai />}
            />

            <NumericalRows
              m="16px 0"
              items={[
                {
                  label: "Your DAI balance",
                  value: `${format(daiBalance)} DAI`,
                },
                {
                  label: "New amount in default",
                  value: `${format(owed.sub(amount.raw))} DAI`,
                },
              ]}
            />

            <ExpandingInfo mb="16px" icon={WarningIcon} title="Write-off consumes your DAI balance">
              <Text m={0}>
                When you publicly write-off the debt of a member, the DAI used is consumed and
                cannot be redeemed.
              </Text>
            </ExpandingInfo>

            <Button fluid label="Write-off debt" {...buttonProps} />
            <Button
              fluid
              mt="8px"
              label="Cancel"
              color="secondary"
              variant="light"
              onClick={close}
            />
          </Modal.Container>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
