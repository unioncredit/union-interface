import {
  Modal,
  ModalOverlay,
  Button,
  Dai,
  Input,
  NumericalBlock,
  NumericalRows,
} from "@unioncredit/ui";

import format from "utils/format";
import useForm from "hooks/useForm";
import { useModals } from "providers/ModalManager";
import { useVouchee, useVouchees } from "providers/VoucheesData";
import { Errors } from "constants";
import { MANAGE_CONTACT_MODAL } from "./ManageContactModal";
import useWrite from "hooks/useWrite";
import { ZERO } from "constants";
import { AddressSummary } from "components/shared";

export const EDIT_VOUCH_MODAL = "edit-vouch-modal";

export default function EditVouchModal({ address, clearContact }) {
  const { close, open } = useModals();
  const { refetch: refetchVouchees } = useVouchees();
  const vouchee = useVouchee(address);

  const { locking = ZERO, trust = ZERO } = vouchee;

  const back = () =>
    open(MANAGE_CONTACT_MODAL, {
      address,
      clearContact,
    });

  const validate = (inputs) => {
    if (inputs.amount.raw.lt(locking)) {
      return Errors.TRUST_LT_LOCKING;
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
    method: "updateTrust",
    args: [address, amount.raw],
    enabled: amount.raw.gte(locking),
    onComplete: async () => {
      await refetchVouchees();
      back();
    },
  });

  return (
    <ModalOverlay onClick={handleClose}>
      <Modal className="EditVouchModal">
        <Modal.Header onClose={handleClose}>
          <AddressSummary m={0} address={address} />
        </Modal.Header>
        <Modal.Body>
          <Modal.Container direction="vertical">
            <NumericalBlock
              align="left"
              token="dai"
              title="Trust you provide"
              value={format(trust)}
            />

            <Input
              mt="16px"
              type="number"
              suffix={<Dai />}
              label="New trust amount"
              onChange={register("amount")}
              error={errors.amount}
              placeholder="0"
            />

            <NumericalRows
              m="20px 0"
              items={[
                {
                  label: "Minimum trust",
                  value: `${format(locking)} DAI`,
                  tooltip: {
                    shrink: true,
                    content: "TODO",
                    position: "right",
                  },
                },
              ]}
            />

            <Button fluid label="Change trust" {...buttonProps} />
            <Button
              fluid
              mt="8px"
              label="Cancel"
              color="secondary"
              variant="light"
              onClick={back}
            />
          </Modal.Container>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
