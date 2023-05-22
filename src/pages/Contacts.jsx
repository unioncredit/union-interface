import { Helmet } from "react-helmet";

import ContactList from "components/contacts/ContactList";

export default function ContactsPage({ type }) {
  return (
    <>
      <Helmet>
        <title>Contacts | Union Credit Protocol</title>
      </Helmet>

      <ContactList initialType={type} />
    </>
  );
}
