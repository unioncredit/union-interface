import { Badge } from "@unioncredit/ui";
import { ZERO } from "constants";
import { useMemberData } from "providers/MemberData";

import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import { compareAddresses } from "utils/compare";

export function StatusBadge({ address }) {
  const { data: member } = useMemberData(address);
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();

  const voucherOrVouchee =
    vouchees.find((vouchee) => compareAddresses(vouchee.address, address)) ||
    vouchers.find((voucher) => compareAddresses(voucher.address, address));

  const contact = voucherOrVouchee || member;

  const isOverdue = contact?.isOverdue;
  const isMember = contact?.isMember;
  const borrowed = contact?.locking || ZERO;

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
        <Badge color="grey" label="Inactive" />
      )}
    </>
  );
}
