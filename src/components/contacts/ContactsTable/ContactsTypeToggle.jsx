import { Box, SegmentedControl } from "@unioncredit/ui";
import { ContactsType } from "constants";

export const ContactsTypeToggle = ({ type, setType }) => (
  <Box fluid>
    <SegmentedControl
      value={type}
      onChange={(tab) => setType(tab.id)}
      items={[
        {
          id: ContactsType.VOUCHEES,
          label: "Providing",
        },
        {
          id: ContactsType.VOUCHERS,
          label: "Receiving",
        },
      ]}
    />
  </Box>
);
