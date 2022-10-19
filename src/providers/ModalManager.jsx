import { createContext, useContext, useState } from "react";

import CreditRequestModal, {
  CREDIT_REQUEST_MODAL,
} from "components/modals/CreditRequestModal";
import AccountModal, { ACCOUNT_MODAL } from "components/modals/AccountModal";
import StakeModal, { STAKE_MODAL } from "components/modals/StakeModal";
import WalletModal, { WALLET_MODAL } from "components/modals/WalletModal";
import VouchModal, { VOUCH_MODAL } from "components/modals/VouchModal";

const ModalContext = createContext({});

export const useModals = () => useContext(ModalContext);

const modals = {
  [ACCOUNT_MODAL]: AccountModal,
  [STAKE_MODAL]: StakeModal,
  [WALLET_MODAL]: WalletModal,
  [CREDIT_REQUEST_MODAL]: CreditRequestModal,
  [VOUCH_MODAL]: VouchModal,
};

export default function ModalManager({ children }) {
  const [props, setProps] = useState(null);
  const [modal, setModal] = useState(null);

  const close = () => {
    setModal(null);
    setProps(null);
  };

  const open = (key, props) => {
    setModal(key);
    if (props) setProps(props);
  };

  const modalCtx = {
    close,
    open,
  };

  const Modal = modals[modal];

  return (
    <ModalContext.Provider value={modalCtx}>
      {children}
      {Modal && <Modal {...props} />}
    </ModalContext.Provider>
  );
}
