import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import ContactList from "components/contacts/ContactList";
import { CreditSegmentedControl } from "components/shared/CreditSegmentedControl";
import { ContactsType } from "constants";
import { useModals } from "providers/ModalManager";
import { MANAGE_CONTACT_MODAL } from "components/modals/ManageContactModal";

export default function ContactsPage() {
  const { open } = useModals();

  const [contact, setContact] = useState(null);
  const [type, setType] = useState(ContactsType.VOUCHEES);

  const contactComponentProps = {
    type,
    setType,
    contact,
    setContact,
  };

  useEffect(() => {
    if (contact) {
      open(MANAGE_CONTACT_MODAL, {
        address: contact.address,
        clearContact: () => setContact(null),
      });
    }
  }, [contact]);

  return (
    <>
      <Helmet>
        <title>Contacts | Union Credit Protocol</title>
      </Helmet>

      <CreditSegmentedControl active={2} />

      <ContactList {...contactComponentProps} />
    </>
  );
}
