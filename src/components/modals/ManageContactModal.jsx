import "./ManageContactModal.scss";

import { Modal, ModalOverlay, SegmentedControl } from "@unioncredit/ui";
import { AddressSummary, TransactionHistory } from "components/shared";

import { ContactDetailsTab } from "components/modals/ManageContactModal/ContactDetailsTab";
import { useModals } from "providers/ModalManager";
import { useState } from "react";

export const MANAGE_CONTACT_MODAL = "manager-contact-modal";

const TABS = {
  CONTACT_DETAILS: "contact-details",
  ACTIVITY: "activity",
};

export default function ManageContactModal({ address, clearContact }) {
  const { close } = useModals();
  const [activeTab, setActiveTab] = useState(TABS.CONTACT_DETAILS);

  const handleClose = () => {
    clearContact?.();
    close();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <Modal className="ManageContactModal">
        <Modal.Header onClose={handleClose}>
          <AddressSummary m={0} address={address} />
        </Modal.Header>
        <Modal.Body>
          <SegmentedControl
            className="ManageContactModal__tabs"
            onChange={(item) => setActiveTab(item.id)}
            items={[
              { id: TABS.CONTACT_DETAILS, label: "Contact Details" },
              { id: TABS.ACTIVITY, label: "Activity" },
            ]}
          />

          {activeTab === TABS.CONTACT_DETAILS && (
            <ContactDetailsTab address={address} clearContact={clearContact} />
          )}

          {activeTab === TABS.ACTIVITY && (
            <TransactionHistory staker={address} pageSize={5} />
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
