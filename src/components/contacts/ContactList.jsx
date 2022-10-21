import { Card } from "@unioncredit/ui";
import { ContactsType } from "constants";

import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";

export default function ContactList({ type = ContactsType.VOUCHEES }) {
  const { data: vouchees } = useVouchees();
  const { data: vouchers } = useVouchers();

  const contacts = (type === ContactsType.VOUCHEES ? vouchees : vouchers) || [];

  return (
    <Card>
      <Card.Header
        title={`Accounts you trust · ${Object.keys(contacts).length}`}
        subTitle="Addresses you’re currently vouching for"
      />
      <Card.Body></Card.Body>
    </Card>
  );
}
