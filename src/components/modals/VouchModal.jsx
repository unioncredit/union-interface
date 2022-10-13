import JSConfetti from "js-confetti";
import { Modal, ModalOverlay, Input, Dai, Button } from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import AddressInput from "components/shared/AddressInput";
import { useEffect } from "react";

export const VOUCH_MODAL = "vouch-modal";

const jsConfetti = new JSConfetti();

export default function VouchModal({ title = "New Vouch" }) {
  const { close } = useModals();

  useEffect(() => {
    const intervalId = setInterval(() => {
      jsConfetti.addConfetti();
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
      <Modal>
        <Modal.Header onClose={close} title={title} />
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
