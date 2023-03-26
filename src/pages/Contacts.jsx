import { useState } from "react";
import { Helmet } from "react-helmet";
import { Grid, Layout } from "@unioncredit/ui";

import ContactList from "components/contacts/ContactList";
import ContactDetails from "components/contacts/ContactDetails";
import { CreditSegmentedControl } from "components/shared/CreditSegmentedControl";

export default function ContactsPage({ type }) {
  const [contact, setContact] = useState(null);

  const contactComponentProps = {
    contact,
    setContact,
    type,
  };

  return (
    <>
      <Helmet>
        <title>Contacts | Union Credit Protocol</title>
      </Helmet>
      <Layout.Columned align="center" maxw="988">
        <CreditSegmentedControl active={2} />

        <Grid>
          <Grid.Row justify="center">
            <Grid.Col md={6}>
              <ContactList {...contactComponentProps} />
            </Grid.Col>
            <Grid.Col md={6}>
              <ContactDetails {...contactComponentProps} />
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Layout.Columned>
    </>
  );
}
