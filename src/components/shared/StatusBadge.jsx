import { BadgeIndicator } from "@unioncredit/ui";
import { ZERO } from "constants";
import { useMemberData } from "providers/MemberData";

import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import { compareAddresses } from "utils/compare";

export function StatusBadge({ address }) {
  const { data: member } = useMemberData(address);
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();

  const { isMember } = member;

  const voucherOrVouchee =
    vouchees.find((vouchee) => compareAddresses(vouchee.address, address)) ||
    vouchers.find((voucher) => compareAddresses(voucher.address, address));

  const contact = voucherOrVouchee || member;
  const isOverdue = contact?.isOverdue;
  const borrowed = contact?.locking || ZERO;

  return (
    <>
      {borrowed.gt(0) ? (
        <BadgeIndicator
          color={isOverdue ? "red500" : "green500"}
          label={isOverdue ? "Overdue" : "Borrowing"}
        />
      ) : isMember ? (
        <BadgeIndicator color="blue500" label="Member" />
      ) : (
        <BadgeIndicator label="Not-member" />
      )}
    </>
  );
}
