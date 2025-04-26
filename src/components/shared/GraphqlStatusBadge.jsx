import { BadgeIndicator } from "@unioncredit/ui";

import { ZERO } from "constants";

export const GraphqlStatusBadge = ({ data, protocol, blockNumber }) => {
  const { overdueTime = ZERO, maxOverdueTime = ZERO } = protocol;

  const { isOverdue, isMember } = data;

  const lastRepay = BigInt(data.lastRepay || "0");
  const owed = BigInt(data.owed || "0");

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
