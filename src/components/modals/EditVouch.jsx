import {
  Modal,
  ModalOverlay,
  Button,
  Grid,
  Stat,
  Dai,
  Input,
} from "@unioncredit/ui";

import format from "utils/format";
import useForm from "hooks/useForm";
import { useModals } from "providers/ModalManager";
import { useVouchees } from "providers/VoucheesData";
import { compareAddresses } from "utils/compare";
import { Errors } from "constants";
import { MANAGE_CONTACT_MODAL } from "./ManageContactModal";
import { ContactsType } from "constants";
import useWrite from "hooks/useWrite";
import { ZERO } from "constants";

export const EDIT_VOUCH_MODAL = "edit-vouch-modal";

export default function EditVouchModal({ address }) {
  const { close, open } = useModals();
  const { data: vouchees = [], refetch: refetchVouchees } = useVouchees();

  const vouchee = vouchees.find((v) => compareAddresses(v.address, address));

  const { locking = ZERO, trust = ZERO } = vouchee;

  const back = (contact) =>
    open(MANAGE_CONTACT_MODAL, {
      contact: contact,
      type: ContactsType.VOUCHEES,
    });

  const validate = (inputs) => {
    if (inputs.amount.raw.lt(locking)) {
      return Errors.TRUST_LT_LOCKING;
    }
  };

  const { register, errors = {}, values = {}, empty } = useForm({ validate });

  const amount = values.amount || empty;

  const buttonProps = useWrite({
    contract: "userManager",
    method: "updateTrust",
    args: [address, amount.raw],
    enabled: amount.raw.gte(locking),
    onComplete: async () => {
      const response = await refetchVouchees();
      const contact = response.data.find((c) =>
        compareAddresses(c.address, address)
      );
      back(contact);
    },
  });

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="EditVouchModal">
        <Modal.Header title="Adjust trust" onClose={close} onBack={back} />
        <Modal.Body>
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <Stat
                  mb="24px"
                  size="medium"
                  align="center"
                  label="Current trust"
                  value={<Dai value={format(trust)} />}
                />
              </Grid.Col>
              <Grid.Col>
                <Stat
                  mb="24px"
                  size="medium"
                  align="center"
                  label="Unpaid debt"
                  value={<Dai value={format(locking)} />}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
          <Input
            type="number"
            suffix={<Dai />}
            label="New trust amount"
            onChange={register("amount")}
            error={errors.amount}
          />
          <Button
            fluid
            mt="18px"
            fontSize="large"
            label="Set new trust"
            {...buttonProps}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
