import { useState } from "react";
import { Helmet } from "react-helmet";

import ContactList from "components/contacts/ContactList";
import { CreditSegmentedControl } from "components/shared/CreditSegmentedControl";
import { ContactsType } from "constants";

export default function ContactsPage() {
  const [contact, setContact] = useState(null);
  const [type, setType] = useState(ContactsType.VOUCHEES);

  const contactComponentProps = {
    type,
    setType,
    contact,
    setContact,
  };

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
