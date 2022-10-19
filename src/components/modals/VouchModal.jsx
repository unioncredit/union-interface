import "./VouchModal.scss";

import cn from "classnames";
import { useEffect } from "react";
import JSConfetti from "js-confetti";
import { Modal, ModalOverlay, Input, Dai, Button } from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import AddressInput from "components/shared/AddressInput";
import NewMemberModalHeader from "components/modals/NewMemberModalHeader";

export const VOUCH_MODAL = "vouch-modal";

const jsConfetti = new JSConfetti();

const popConfetti = () => jsConfetti.addConfetti();

export default function VouchModal({
  title = "New Vouch",
  subTitle = "",
  isNewMemberModal = true,
}) {
  const { close } = useModals();

  useEffect(() => {
    const intervalId = setInterval(() => {
      popConfetti();
    }, 1000);

    const timerId = setTimeout(() => {
      clearInterval(intervalId);
    }, 5000);

    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ModalOverlay onClick={close}>
      <Modal
        className={cn("VouchModal", {
          "VouchModal--newMember": isNewMemberModal,
        })}
      >
        {isNewMemberModal && (
          <NewMemberModalHeader onClose={close} confettiAction={popConfetti} />
        )}
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
