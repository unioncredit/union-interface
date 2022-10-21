import { Box, ToggleMenu, Grid } from "@unioncredit/ui";

import { ContactsType } from "constants";
import Header from "components/shared/Header";
import ContactList from "components/contacts/ContactList";
import ContactDetails from "components/contacts/ContactDetails";
import { Link } from "react-router-dom";

export default function ContactsPage({ type }) {
  return (
    <>
      <Header />
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
          initialActive={0}
        />
      </Box>
      <Grid>
        <Grid.Row justify="center">
          <Grid.Col md={6}>
            <ContactList type={type} />
          </Grid.Col>
          <Grid.Col md={6}>
            <ContactDetails />
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </>
  );
}
