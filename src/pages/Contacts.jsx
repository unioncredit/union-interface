import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Box, ToggleMenu, Grid } from "@unioncredit/ui";

import { ContactsType } from "constants";
import ContactList from "components/contacts/ContactList";
import ContactDetails from "components/contacts/ContactDetails";

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
      <Box justify="center" fluid mb="24px">
        <ToggleMenu
          className="ToggleMenu"
          items={[
            {
              as: Link,
              id: ContactsType.VOUCHEES,
              label: "You trust",
              to: "/contacts",
            },
            {
              as: Link,
              id: ContactsType.VOUCHERS,
              label: "Trusts you",
              to: "/contacts/trusts-you",
            },
          ]}
          onChange={() => setContact(null)}
          initialActive={0}
        />
      </Box>
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
    </>
  );
}
