import { BadgeIndicator } from "@unioncredit/ui";
import { ZERO } from "constants";
import { useMemberData } from "providers/MemberData";

import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import { compareAddresses } from "utils/compare";
import { useProtocol } from "../../providers/ProtocolData";
import { useVersionBlockNumber } from "../../hooks/useVersionBlockNumber";
import { useNetwork } from "wagmi";
import { BigNumber } from "ethers";

export function StatusBadge({ address }) {
  const { chain } = useNetwork();
  const { data: protocol } = useProtocol();
  const { data: member } = useMemberData(address);
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId: chain.id,
  });

  const { isMember } = member;
  const { overdueTime = ZERO, maxOverdueTime = ZERO } = protocol;

  const voucherOrVouchee =
    vouchees.find((vouchee) => compareAddresses(vouchee.address, address)) ||
    vouchers.find((voucher) => compareAddresses(voucher.address, address));

  const contact = voucherOrVouchee || member;

  const lastRepay = contact?.lastRepay;
  const isOverdue = contact?.isOverdue;
  const borrowed = contact?.locking || ZERO;

  const maxOverdueTotal = overdueTime.add(maxOverdueTime);
  const isMaxOverdue =
    isOverdue && lastRepay && BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

  return (
    <>
      {borrowed.gt(0) ? (
        <BadgeIndicator
          color={isOverdue ? "red500" : "green500"}
          label={isMaxOverdue ? "Write-Off" : isOverdue ? "Overdue" : "Borrowing"}
          textColor={isMaxOverdue && "red500"}
        />
      ) : isMember ? (
        <BadgeIndicator color="blue500" label="Member" />
      ) : (
        <BadgeIndicator label="Not-member" />
      )}
    </>
  );
}
