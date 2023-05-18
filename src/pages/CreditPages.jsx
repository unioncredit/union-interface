import { Layout } from "@unioncredit/ui";

import { CreditSegmentedControl } from "components/shared/CreditSegmentedControl";
import BorrowPage from "pages/Borrow";
import StakePage from "pages/Stake";
import ContactsPage from "pages/Contacts";
import { ContactsType } from "constants";

export const PAGES = {
  BORROW: {
    id: "borrow",
    maxw: "653px",
    initialActive: 0,
    component: <BorrowPage />,
  },
  STAKE: {
    id: "stake",
    maxw: "653px",
    initialActive: 1,
    component: <StakePage />,
  },
  CONTACTS_PROVIDING: {
    id: "contacts",
    maxw: "none",
    initialActive: 2,
    component: <ContactsPage type={ContactsType.VOUCHEES} />,
  },
  CONTACTS_RECEIVING: {
    id: "contacts",
    maxw: "none",
    initialActive: 2,
    component: <ContactsPage type={ContactsType.VOUCHERS} />,
  },
};

export default function CreditPages({ page }) {
  const { id, maxw, initialActive, component } = page;

  return (
    <Layout.Columned align="center" maxw={maxw}>
      <CreditSegmentedControl
        value={id}
        maxw="653px"
        initialActive={initialActive}
      />

      {component}
    </Layout.Columned>
  );
}
