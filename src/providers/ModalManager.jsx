import { createContext, useContext, useState } from "react";

import AccountModal, { ACCOUNT_MODAL } from "components/modals/AccountModal";

const ModalContext = createContext({});

export const useModals = () => useContext(ModalContext);

const modals = {
  [ACCOUNT_MODAL]: AccountModal,
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
