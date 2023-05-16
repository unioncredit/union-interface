import { Helmet } from "react-helmet";

import ContactList from "components/contacts/ContactList";
import { CreditSegmentedControl } from "components/shared/CreditSegmentedControl";
import { Layout } from "@unioncredit/ui";

export default function ContactsPage({ type }) {
  return (
    <>
      <Helmet>
        <title>Contacts | Union Credit Protocol</title>
      </Helmet>

      <Layout.Columned maxw="653px">
        <CreditSegmentedControl active={2} />
      </Layout.Columned>

      <ContactList initialType={type} />
    </>
  );
}
