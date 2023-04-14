import { Box, SegmentedControl } from "@unioncredit/ui";
import { ContactsType } from "constants";
import { Link } from "react-router-dom";

export const ContactsTypeToggle = ({ type, setType, clearFilters }) => (
  <Box fluid>
    <SegmentedControl
      value={type}
      initialActive={type === ContactsType.VOUCHEES ? 0 : 1}
      onChange={(tab) => {
        setType(tab.id);
        clearFilters();
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
