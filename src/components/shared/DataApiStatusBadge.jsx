import { BadgeIndicator } from "@unioncredit/ui";

import { ZERO } from "constants";
import { expandToString } from "utils/format";

export const DataApiStatusBadge = ({ data, protocol, blockNumber }) => {
  const { overdueTime = ZERO, maxOverdueTime = ZERO } = protocol;
  const { contracts, credit } = data;
  const isOverdue = contracts.is_overdue;
  const isMember = contracts.is_member;

  const lastRepay = BigInt(credit.repays.blocks.last || "0");
  const owed = BigInt(expandToString(contracts.total_owed.total) || "0");

  const maxOverdueTotal = overdueTime + maxOverdueTime;

  const isMaxOverdue = isOverdue && lastRepay && BigInt(blockNumber) >= lastRepay + maxOverdueTotal;

  return isMaxOverdue ? (
    <BadgeIndicator label="Write-Off" color="red500" textColor="red500" />
  ) : isOverdue ? (
    <BadgeIndicator label="Overdue" color="red500" textColor="red500" />
  ) : owed > ZERO ? (
    <BadgeIndicator label="Borrowing" color="green500" />
  ) : isMember ? (
    <BadgeIndicator label="Member" color="blue500" />
  ) : (
    <BadgeIndicator label="Non-member" />
  );
};
