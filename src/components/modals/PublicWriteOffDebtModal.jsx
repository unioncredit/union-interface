import {
  Button,
  ExpandingInfo,
  Input,
  Modal,
  ModalOverlay,
  NumericalBlock,
  NumericalRows,
  Text,
  WarningIcon,
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
import Token from "components/Token";
import { useToken } from "hooks/useToken";

export const PUBLIC_WRITE_OFF_DEBT_MODAL = "public-write-off-debt-modal";

export default function PublicWriteOffDebtModal({ address }) {
  const { close } = useModals();
  const { address: connectedAddress } = useAccount();
  const { token } = useToken();

  const { data: contact } = useMemberData(address);
  const { data: member } = useMember();

  const { owed = ZERO, isOverdue } = contact;
  const { tokenBalance = ZERO } = member;

  const validate = (inputs) => {
    if (inputs.amount?.raw > owed) {
      return "Amount exceeds defaulted value";
    }
  };

  const { register, setRawValue, errors = {}, values = {}, empty } = useForm({ validate });

  const amount = values.amount || empty;

  const buttonProps = useWrite({
    contract: "userManager",
    method: "debtWriteOff",
    args: [connectedAddress, address, amount.raw],
    enabled: isOverdue && address && amount.raw > ZERO,
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
              token={token.toLowerCase()}
              title="Amount in default"
              value={format(owed, token)}
            />

            <Input
              mt="16px"
              type="number"
              name="amount"
              label="Amount to write-off"
              error={errors.amount}
              value={amount.display}
              onChange={register("amount")}
              rightLabel={`Max. ${format(
                tokenBalance >= owed ? owed : tokenBalance,
                token
              )} ${token}`}
              rightLabelAction={() =>
                setRawValue("amount", tokenBalance >= owed ? owed : tokenBalance, false)
              }
              suffix={<Token />}
            />

            <NumericalRows
              m="16px 0"
              items={[
                {
                  label: `Your ${token} balance`,
                  value: `${format(tokenBalance, token)} ${token}`,
                },
                {
                  label: "New amount in default",
                  value: `${format(owed - amount.raw, token)} ${token}`,
                },
              ]}
            />

            <ExpandingInfo
              mb="16px"
              icon={WarningIcon}
              title={`Write-off consumes your ${token} balance`}
            >
              <Text m={0}>
                When you publicly write-off the debt of a member, the {token} used is consumed and
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
