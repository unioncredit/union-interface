import { createContext, useContext, useState } from "react";

import VouchLinkModal, {
  VOUCH_LINK_MODAL,
} from "components/modals/VouchLinkModal";
import ManageContactModal, {
  MANAGE_CONTACT_MODAL,
} from "components/modals/ManageContactModal";
import VouchModal from "components/modals/VouchModal";
import AccountModal, { ACCOUNT_MODAL } from "components/modals/AccountModal";
import StakeModal, { STAKE_MODAL } from "components/modals/StakeModal";
import WalletModal, { WALLET_MODAL } from "components/modals/WalletModal";
import RepayModal, { REPAY_MODAL } from "components/modals/RepayModal";
import BorrowModal, { BORROW_MODAL } from "components/modals/BorrowModal";
import DelegateModal, { DELEGATE_MODAL } from "components/modals/DelegateModal";
import EditVouchModal, { EDIT_VOUCH_MODAL } from "components/modals/EditVouch";
import WriteOffDebtModal, {
  WRITE_OFF_DEBT_MODAL,
} from "components/modals/WriteOffDebtModal";
import PaymentReminderModal, {
  PAYMENT_REMINDER_MODAL,
} from "components/modals/PaymentReminderModal";

const ModalContext = createContext({});

export const useModals = () => useContext(ModalContext);

const modals = {
  [ACCOUNT_MODAL]: AccountModal,
  [STAKE_MODAL]: StakeModal,
  [WALLET_MODAL]: WalletModal,
  [VOUCH_LINK_MODAL]: VouchLinkModal,
  // TODO: some bug that doesn't allow VOUCH_MODAL to be imported... weird.
  ["vouch-modal"]: VouchModal,
  [REPAY_MODAL]: RepayModal,
  [BORROW_MODAL]: BorrowModal,
  [MANAGE_CONTACT_MODAL]: ManageContactModal,
  [DELEGATE_MODAL]: DelegateModal,
  [EDIT_VOUCH_MODAL]: EditVouchModal,
  [WRITE_OFF_DEBT_MODAL]: WriteOffDebtModal,
  [PAYMENT_REMINDER_MODAL]: PaymentReminderModal,
};

export default function ModalManager({ children }) {
  const [props, setProps] = useState(null);
  const [modal, setModal] = useState(null);

  const close = () => {
    document.body.classList.remove("no-scroll");
    setModal(null);
    setProps(null);
  };

  const open = (key, props) => {
    document.body.classList.add("no-scroll");
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
