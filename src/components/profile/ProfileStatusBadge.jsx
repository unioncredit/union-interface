import { BigNumber } from "ethers";
import { Badge } from "@unioncredit/ui";

import { ZERO } from "constants";
import { useVersionBlockNumber } from "hooks/useVersionBlockNumber";
import { useProtocol } from "providers/ProtocolData";

export const ProfileStatusBadge = ({ member, chainId }) => {
  const { data: protocol } = useProtocol();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId,
  });

  const { isMember = false, isOverdue = false, lastRepay = ZERO, owed = ZERO } = member;
  const { overdueTime = ZERO, maxOverdueTime = ZERO } = protocol;

  const maxOverdueTotal = overdueTime.add(maxOverdueTime);

  const isMaxOverdue =
    isOverdue && lastRepay && BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

  return isMaxOverdue ? (
    <Badge label="Write-Off" color="red" />
  ) : isOverdue ? (
    <Badge label="Overdue" color="red" />
  ) : owed.gt(ZERO) ? (
    <Badge label="Borrowing" color="green" />
  ) : isMember ? (
    <Badge label="Member" color="blue" />
  ) : (
    <Badge label="Non-member" color="grey" />
  );
};
