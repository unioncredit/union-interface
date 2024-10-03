import { ZERO } from "constants";
import { BigNumber } from "ethers";
import { expandToString } from "../../utils/format";
import { BadgeIndicator } from "@unioncredit/ui";

export const DataApiStatusBadge = ({ data, protocol, blockNumber }) => {
  const { overdueTime = ZERO, maxOverdueTime = ZERO } = protocol;
  const { contracts, credit } = data;
  const isOverdue = contracts.is_overdue;
  const isMember = contracts.is_member;

  const lastRepay = BigNumber.from(credit.repays.blocks.last || "0");
  const owed = BigNumber.from(expandToString(contracts.total_owed.total) || "0");

  const maxOverdueTotal = overdueTime.add(maxOverdueTime);

  const isMaxOverdue =
    isOverdue && lastRepay && BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

  return isMaxOverdue ? (
    <BadgeIndicator label="Write-Off" color="red500" textColor="red500" />
  ) : isOverdue ? (
    <BadgeIndicator label="Overdue" color="red500" textColor="red500" />
  ) : owed.gt(ZERO) ? (
    <BadgeIndicator label="Borrowing" color="green500" />
  ) : isMember ? (
    <BadgeIndicator label="Member" color="blue500" />
  ) : (
    <BadgeIndicator label="Non-member" />
  );
};
