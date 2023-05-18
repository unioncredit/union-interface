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
    component: <BorrowPage />,
  },
  STAKE: {
    id: "stake",
    maxw: "653px",
    component: <StakePage />,
  },
  CONTACTS_PROVIDING: {
    id: "contacts",
    maxw: "none",
    component: <ContactsPage type={ContactsType.VOUCHEES} />,
  },
  CONTACTS_RECEIVING: {
    id: "contacts",
    maxw: "none",
    component: <ContactsPage type={ContactsType.VOUCHERS} />,
  },
};

export default function CreditPages({ page }) {
  const { id, maxw, component } = page;

  return (
    <Layout.Columned align="center" maxw={maxw}>
      <CreditSegmentedControl maxw="653px" value={id} />
      {component}
    </Layout.Columned>
  );
}
