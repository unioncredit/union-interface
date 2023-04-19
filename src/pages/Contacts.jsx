import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import ContactList from "components/contacts/ContactList";
import { CreditSegmentedControl } from "components/shared/CreditSegmentedControl";
import { useModals } from "providers/ModalManager";
import { MANAGE_CONTACT_MODAL } from "components/modals/ManageContactModal";
import { Layout } from "@unioncredit/ui";

export default function ContactsPage({ type: initialType }) {
  const { open } = useModals();

  const [contact, setContact] = useState(null);
  const [type, setType] = useState(initialType);

  const contactComponentProps = {
    contact: contactIndex !== null ? contacts[contactIndex] : null,
    setContactIndex,
    contacts,
    type,
    setType,
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

      <Layout.Columned maxw="653px">
        <CreditSegmentedControl active={2} />
      </Layout.Columned>

      <ContactList {...contactComponentProps} />
    </>
  );
}
