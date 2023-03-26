import { Link } from "react-router-dom";
import {
  AddressBookIcon,
  IdentityIcon,
  SegmentedControl,
  StakeIcon,
} from "@unioncredit/ui";
import { Links } from "constants";

export const CreditSegmentedControl = ({ active }) => (
  <SegmentedControl
    m="24px 0"
    size="large"
    variant="rounded"
    initialActive={active}
    items={[
      {
        id: "borrow",
        label: "Borrow",
        to: Links.CREDIT,
        as: Link,
        icon: IdentityIcon,
      },
      {
        id: "stake",
        label: "Stake",
        to: Links.STAKE,
        as: Link,
        icon: StakeIcon,
      },
      {
        id: "contacts",
        label: "Contacts",
        to: Links.CONTACTS,
        as: Link,
        icon: AddressBookIcon,
      },
    ]}
  />
);
