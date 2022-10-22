import { Badge } from "@unioncredit/ui";
import { ZERO } from "constants";

import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";

export default function StatusBadge({ address }) {
  const { data: vouchees } = useVouchees();
  const { data: vouchers } = useVouchers();

  const contact =
    vouchees.find((vouchee) => vouchee.address === address) ||
    vouchers.find((voucher) => voucher.address === address);

  const isOverdue = contact.isOverdue;
  const isMember = contact.isMember;
  const borrowed = contact.locking || ZERO;

  return (
    <>
      {borrowed.gt(0) ? (
        <Badge
          color={isOverdue ? "red" : "green"}
          label={isOverdue ? "Overdue" : "Borrowing"}
        />
      ) : isMember ? (
        <Badge color="blue" label="Member" />
      ) : (
        <Badge color="grey" label="Not a member" />
      )}
    </>
  );
}
