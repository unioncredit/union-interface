import "./CreditSegmentedControl.scss";

import { Link, useSearchParams } from "react-router-dom";
import { AddressBookIcon, IdentityIcon, SegmentedControl, StakeIcon } from "@unioncredit/ui";
import { Links } from "constants";

export const CreditSegmentedControl = ({ value, ...props }) => {
  const [searchParams] = useSearchParams();

  const filters = searchParams
    .getAll("filters")
    .map((f) => `filters=${f}`)
    .join("&");

  return (
    <SegmentedControl
      fluid
      m="24px auto"
      size="large"
      variant="rounded"
      value={value}
      className="CreditSegmentedControl"
      {...props}
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
          to: filters.length > 0 ? `${Links.CONTACTS}?${filters}` : Links.CONTACTS,
          as: Link,
          icon: AddressBookIcon,
        },
      ]}
    />
  );
};
