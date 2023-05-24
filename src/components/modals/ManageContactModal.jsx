import "./ManageContactModal.scss";

import {
  Text,
  ArrowLeftIcon,
  ArrowRightIcon,
  Box,
  Button,
  CloseIcon,
  Modal,
  ModalOverlay,
  SegmentedControl,
} from "@unioncredit/ui";
import { AddressSummary, TransactionHistory } from "components/shared";

import { ContactDetailsTab } from "components/modals/ManageContactModal/ContactDetailsTab";
import { useModals } from "providers/ModalManager";
import { useState } from "react";

export const MANAGE_CONTACT_MODAL = "manager-contact-modal";

const TABS = {
  CONTACT_DETAILS: "contact-details",
  ACTIVITY: "activity",
};

export default function ManageContactModal({
  address,
  nextContact,
  prevContact,
  contactIndex,
  contactsCount,
  clearContact,
}) {
  const { close } = useModals();
  const [activeTab, setActiveTab] = useState(TABS.CONTACT_DETAILS);

  const handleClose = () => {
    clearContact?.();
    close();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <Modal className="ManageContactModal">
        <Modal.Header onClose={handleClose} noHeight hideClose>
          <Box
            fluid
            justify="space-between"
            className="ManageContactModal__navigation"
          >
            <Box>
              <Button onClick={handleClose} icon={CloseIcon} />
              <Text>
                Contact · {contactIndex + 1} of {contactsCount}
              </Text>
            </Box>

            <Box>
              <Button
                icon={ArrowLeftIcon}
                onClick={prevContact}
                disabled={contactIndex <= 0}
              />
              <Button
                onClick={nextContact}
                icon={ArrowRightIcon}
                disabled={contactIndex + 1 >= contactsCount}
              />
            </Box>
          </Box>

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
            <ContactDetailsTab
              address={address}
              nextContact={nextContact}
              prevContact={prevContact}
              contactIndex={contactIndex}
              contactsCount={contactsCount}
              clearContact={clearContact}
            />
          )}

          {activeTab === TABS.ACTIVITY && (
            <TransactionHistory staker={address} pageSize={5} />
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
