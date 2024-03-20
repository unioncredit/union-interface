import {
  Button,
  Dai,
  Usdc,
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
import { useSettings } from "providers/Settings";
import Token from "components/Token";

export const PUBLIC_WRITE_OFF_DEBT_MODAL = "public-write-off-debt-modal";

export default function PublicWriteOffDebtModal({ address }) {
  const { close } = useModals();
  const { address: connectedAddress } = useAccount();

  const { data: contact } = useMemberData(address);
  const { data: member } = useMember();
  const {
    settings: { useToken },
  } = useSettings();

  const { owed = ZERO, isOverdue } = contact;
  const { tokenBalance = ZERO } = member;

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
              token={useToken.toLowerCase()}
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
              rightLabel={`Max. ${format(
                tokenBalance.gte(owed) ? owed : tokenBalance
              )} ${useToken}`}
              rightLabelAction={() =>
                setRawValue("amount", tokenBalance.gte(owed) ? owed : tokenBalance, false)
              }
              suffix={<Token />}
            />

            <NumericalRows
              m="16px 0"
              items={[
                {
                  label: `Your ${useToken} balance`,
                  value: `${format(tokenBalance)} ${useToken}`,
                },
                {
                  label: "New amount in default",
                  value: `${format(owed.sub(amount.raw))} ${useToken}`,
                },
              ]}
            />

            <ExpandingInfo
              mb="16px"
              icon={WarningIcon}
              title={`Write-off consumes your ${useToken} balance`}
            >
              <Text m={0}>
                When you publicly write-off the debt of a member, the {useToken} used is consumed
                and cannot be redeemed.
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
