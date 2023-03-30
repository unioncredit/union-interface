import {
  Button,
  Dai,
  Input,
  Text,
  Modal,
  ModalOverlay,
  NumericalBlock,
  NumericalLines,
} from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import { MANAGE_CONTACT_MODAL } from "./ManageContactModal";
import { useVouchee, useVouchees } from "providers/VoucheesData";
import { ZERO } from "constants";
import format from "utils/format";
import { Errors } from "constants";
import useForm from "hooks/useForm";
import useWrite from "hooks/useWrite";
import { AddressSummary } from "components/shared";

export const WRITE_OFF_DEBT_MODAL = "write-off-debt-modal";

export default function WriteOffDebtModal({ address, clearContact }) {
  const { close, open } = useModals();
  const { refetch: refetchVouchees } = useVouchees();

  const vouchee = useVouchee(address);

  const { locking = ZERO, isOverdue } = vouchee;

  const back = () =>
    open(MANAGE_CONTACT_MODAL, {
      address,
      clearContact,
    });

  const validate = (inputs) => {
    if (inputs.amount?.raw.gt(locking)) {
      return Errors.EXCEEDED_LOCK;
    }
  };

  const handleClose = () => {
    clearContact?.();
    close();
  };

  const { register, errors = {}, values = {}, empty } = useForm({ validate });

  const amount = values.amount || empty;

  const buttonProps = useWrite({
    contract: "userManager",
    method: "debtWriteOff",
    args: [vouchee.address, amount.raw],
    enabled: isOverdue && vouchee?.address && amount.raw.gt(ZERO),
    onComplete: async () => {
      await refetchVouchees();
      back();
    },
  });

  return (
    <ModalOverlay onClick={handleClose}>
      <Modal className="WriteOffDebt">
        <Modal.Header onClose={handleClose}>
          <AddressSummary m={0} address={address} />
        </Modal.Header>
        <Modal.Body>
          <Modal.Container direction="vertical">
            <NumericalBlock
              align="left"
              token="dai"
              title="Balance owed"
              value={format(locking)}
            />

            <Input
              mt="16px"
              type="number"
              label="Amount to write-off"
              rightLabel={`Max. ${format(locking)} DAI`}
              suffix={<Dai />}
              error={errors.amount}
              onChange={register("amount")}
            />

            <NumericalLines
              m="20px 0"
              items={[
                {
                  label: "New balance owed",
                  value: `${format(locking.sub(amount.raw))} DAI`,
                },
              ]}
            />

            <Button fluid label="Write-off debt" {...buttonProps} />
            <Button
              fluid
              mt="8px"
              label="Cancel"
              color="secondary"
              variant="light"
              onClick={back}
            />

            <Text m="16px 0 0" grey={600}>
              When you write-off the debt of a vouchee, your locked funds are
              consumed and cannot be redeemed.
            </Text>
          </Modal.Container>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
