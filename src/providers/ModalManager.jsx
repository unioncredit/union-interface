import { createContext, useContext, useState } from "react";

import AccountModal, { ACCOUNT_MODAL } from "components/modals/AccountModal";
import StakeModal, { STAKE_MODAL } from "components/modals/StakeModal";

const ModalContext = createContext({});

export const useModals = () => useContext(ModalContext);

const modals = {
  [ACCOUNT_MODAL]: AccountModal,
  [STAKE_MODAL]: StakeModal,
};

export default function ModalManager({ children }) {
  const [modal, setModal] = useState(null);

  const close = () => setModal(null);

  const open = (key) => setModal(key);

  const modalCtx = {
    close,
    open,
  };

  const Modal = modals[modal];

  return (
    <ModalContext.Provider value={modalCtx}>
      {children}
      {Modal && <Modal />}
    </ModalContext.Provider>
  );
}
