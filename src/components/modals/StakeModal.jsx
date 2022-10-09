import { Modal, ModalOverlay } from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";

export const STAKE_MODAL = "stake-modal";

export default function StakeModal() {
  const { close } = useModals();

  return (
    <ModalOverlay onClick={close}>
      <Modal title="Stake or unstake DIA" onClose={close}></Modal>
    </ModalOverlay>
  );
}

