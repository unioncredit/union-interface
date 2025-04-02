import { BadgeIndicator } from "@unioncredit/ui";
import { useAccount } from "wagmi";

import { useVersionBlockNumber } from "hooks/useVersionBlockNumber";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import { useProtocol } from "providers/ProtocolData";
import { useMemberData } from "providers/MemberData";
import { getVersion } from "providers/Version";
import { compareAddresses } from "utils/compare";
import { ContactsType, ZERO } from "constants";

export function StatusBadge({ address, type, chainId: chainIdProp }) {
  const { chain } = useAccount();
  const chainId = chainIdProp || chain?.id;

  const { data: protocol } = useProtocol();
  const { data: member } = useMemberData(address, chainId, getVersion(chainId));
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId: chainId,
  });

  const { isMember } = member;
  const { overdueTime = ZERO, maxOverdueTime = ZERO } = protocol;

  const voucherOrVouchee =
    type === ContactsType.VOUCHEES
      ? vouchees.find((vouchee) => compareAddresses(vouchee.address, address))
      : type === ContactsType.VOUCHERS
      ? vouchers.find((voucher) => compareAddresses(voucher.address, address))
      : null;

  const contact = voucherOrVouchee || member;

  const lastRepay = contact?.lastRepay;
  const isOverdue = contact?.isOverdue;
  const borrowed = contact?.locking || ZERO;

  const maxOverdueTotal = overdueTime + maxOverdueTime;
  const isMaxOverdue = isOverdue && lastRepay && BigInt(blockNumber) >= lastRepay + maxOverdueTotal;

  return (
    <>
      {isOverdue ? (
        <BadgeIndicator
          color="red500"
          label={isMaxOverdue ? "Write-Off" : "Overdue"}
          textColor={isMaxOverdue && "red500"}
        />
      ) : borrowed > ZERO ? (
        <BadgeIndicator color="green500" label="Borrowing" />
      ) : isMember ? (
        <BadgeIndicator color="blue500" label="Member" />
      ) : (
        <BadgeIndicator label="Non-member" />
      )}
    </>
  );
}
