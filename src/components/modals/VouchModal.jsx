import "./VouchModal.scss";

import React from "react";
import cn from "classnames";
import { Modal, ModalOverlay, Input, Dai, Button } from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import AddressInput from "components/shared/AddressInput";
import NewMemberModalHeader from "components/modals/NewMemberModalHeader";

export const VOUCH_MODAL = "vouch-modal";

const Canvas = React.memo(() => (
  <canvas
    id="confettiCanvas"
    style={{
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
    }}
  />
));

export default function VouchModal({
  title = "New Vouch",
  subTitle = "",
  isNewMemberModal = true,
}) {
  const { close } = useModals();

  return (
    <ModalOverlay onClick={close}>
      <Canvas />
      <Modal
        className={cn("VouchModal", {
          "VouchModal--newMember": isNewMemberModal,
        })}
      >
        {isNewMemberModal && <NewMemberModalHeader onClose={close} />}
        <Modal.Header onClose={close} title={title} subTitle={subTitle} />
        <Modal.Body>
          <AddressInput label="Address or ENS" />
          <Input label="Contact name" />
          <Input label="Trust amount" suffix={<Dai />} />
          <Button fluid mt="16px" label="Submit Vouch" />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
