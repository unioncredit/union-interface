import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  NumericalBlock,
  NumericalRows,
  Text,
} from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import { MANAGE_CONTACT_MODAL } from "./ManageContactModal";
import { useVouchee, useVouchees } from "providers/VoucheesData";
import { Errors, ZERO } from "constants";
import format from "utils/format";
import useForm from "hooks/useForm";
import useWrite from "hooks/useWrite";
import { AddressSummary } from "components/shared";
import { useAccount } from "wagmi";
import Token from "components/Token";
import { useToken } from "hooks/useToken";

export const WRITE_OFF_DEBT_MODAL = "write-off-debt-modal";

export default function WriteOffDebtModal({
  address,
  nextContact,
  prevContact,
  contactIndex,
  contactsCount,
  clearContact,
}) {
  const { address: connectedAddress } = useAccount();
  const { close, open } = useModals();
  const { refetch: refetchVouchees } = useVouchees();
  const { token } = useToken();
  const vouchee = useVouchee(address);

  const { locking = ZERO, isOverdue } = vouchee;

  const back = () =>
    open(MANAGE_CONTACT_MODAL, {
      address,
      nextContact,
      prevContact,
      contactIndex,
      contactsCount,
      clearContact,
    });

  const validate = (inputs) => {
    if (inputs.amount?.raw > locking) {
      return Errors.EXCEEDED_LOCK;
    }
  };

  const handleClose = () => {
    clearContact?.();
    close();
  };

  const { register, setRawValue, errors = {}, values = {}, empty } = useForm({ validate });

  const amount = values.amount || empty;

  const buttonProps = useWrite({
    contract: "userManager",
    method: "debtWriteOff",
    args: [connectedAddress, vouchee.address, amount.raw],
    enabled: isOverdue && vouchee?.address && amount.raw > ZERO,
    onComplete: async () => {
      await refetchVouchees();
      back();
    },
  });

  return (
    <ModalOverlay onClick={handleClose}>
      <Modal className="WriteOffDebt">
        <Modal.Header onClose={handleClose} noHeight>
          <AddressSummary m={0} address={address} />
        </Modal.Header>
        <Modal.Body>
          <Modal.Container direction="vertical">
            <NumericalBlock
              align="left"
              token={token.toLowerCase()}
              title="Balance owed"
              value={format(locking, token)}
            />

            <Input
              mt="16px"
              type="number"
              name="amount"
              label="Amount to write-off"
              error={errors.amount}
              value={amount.display}
              onChange={register("amount")}
              rightLabel={`Max. ${format(locking, token)} ${token}`}
              rightLabelAction={() => setRawValue("amount", locking, false)}
              suffix={<Token />}
            />

            <NumericalRows
              m="20px 0"
              items={[
                {
                  label: "New balance owed",
                  value: `${format(locking - amount.raw, token)} ${token}`,
                },
              ]}
            />

            <Button fluid label="Write-off debt" {...buttonProps} />
            <Button fluid mt="8px" label="Back" color="secondary" variant="light" onClick={back} />

            <Text m="16px 0 0" grey={600}>
              When you write-off the debt of a vouchee, your locked funds are consumed and cannot be
              redeemed.
            </Text>
          </Modal.Container>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
