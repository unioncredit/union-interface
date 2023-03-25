import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  Layout,
  AddressBookIcon,
  IdentityIcon,
  SegmentedControl,
  StakeIcon,
} from "@unioncredit/ui";

import CreditStats from "components/credit/CreditStats";
import ActivityTable from "components/credit/ActivityTable";
import VouchersOverview from "components/credit/VouchersOverview";
import { useVouchers } from "providers/VouchersData";

export default function CreditPage() {
  const { data: vouchers = [] } = useVouchers();

  return (
    <>
      <Helmet>
        <title>Credit | Union Credit Protocol</title>
      </Helmet>
      <Layout.Columned align="center" maxw="653px">
        <SegmentedControl
          m="24px 0"
          size="large"
          variant="rounded"
          items={[
            {
              id: "borrow",
              label: "Borrow",
              to: "/",
              as: Link,
              icon: IdentityIcon,
            },
            {
              id: "stake",
              label: "Stake",
              to: "/stake",
              as: Link,
              icon: StakeIcon,
            },
            {
              id: "contacts",
              label: "Contacts",
              to: "/contacts",
              as: Link,
              icon: AddressBookIcon,
            },
          ]}
        />

        <CreditStats vouchers={vouchers} />
        <VouchersOverview vouchers={vouchers} displayCount={6} />
        <ActivityTable />
      </Layout.Columned>
    </>
  );
}
