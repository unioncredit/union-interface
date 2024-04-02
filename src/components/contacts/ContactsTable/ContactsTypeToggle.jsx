import { Box, SegmentedControl } from "@unioncredit/ui";
import { ContactsType } from "constants";
import { Link } from "react-router-dom";

export const ContactsTypeToggle = ({ type, setType }) => (
  <Box fluid>
    <SegmentedControl
      value={type}
      className="ContactList__toggle"
      initialActive={type === ContactsType.VOUCHEES ? 0 : 1}
      onChange={(tab) => {
        setType(tab.id);
      }}
      items={[
        {
          id: ContactsType.VOUCHEES,
          label: "Providing",
          to: "/contacts/providing",
          as: Link,
        },
        {
          id: ContactsType.VOUCHERS,
          label: "Receiving",
          to: "/contacts/receiving",
          as: Link,
        },
      ]}
    />
  </Box>
);
