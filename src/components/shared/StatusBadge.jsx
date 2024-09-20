import { BadgeIndicator } from "@unioncredit/ui";
import { ContactsType, ZERO } from "constants";
import { useMemberData } from "providers/MemberData";

import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import { compareAddresses } from "utils/compare";
import { useProtocol } from "../../providers/ProtocolData";
import { useVersionBlockNumber } from "../../hooks/useVersionBlockNumber";
import { useNetwork } from "wagmi";
import { BigNumber } from "ethers";
import { getVersion } from "../../providers/Version";

export function StatusBadge({ address, type, chainId: chainIdProp }) {
  const { chain } = useNetwork();
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

  const maxOverdueTotal = overdueTime.add(maxOverdueTime);
  const isMaxOverdue =
    isOverdue && lastRepay && BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

  return (
    <>
      {isOverdue ? (
        <BadgeIndicator
          color="red500"
          label={isMaxOverdue ? "Write-Off" : "Overdue"}
          textColor={isMaxOverdue && "red500"}
        />
      ) : borrowed.gt(ZERO) ? (
        <BadgeIndicator color="green500" label="Borrowing" />
      ) : isMember ? (
        <BadgeIndicator color="blue500" label="Member" />
      ) : (
        <BadgeIndicator label="Non-member" />
      )}
    </>
  );
}
