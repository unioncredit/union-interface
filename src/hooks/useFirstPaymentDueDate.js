import { useNetwork } from "wagmi";
import { useProtocol } from "providers/ProtocolData";
import { BlockSpeed, ZERO } from "constants";
import dueDate, { formatDueDate } from "utils/dueDate";
import { useVersion } from "providers/Version";
import { useMember } from "providers/MemberData";
import { useVersionBlockNumber } from "./useVersionBlockNumber";

export default function useFirstPaymentDueDate() {
  const { isV2 } = useVersion();
  const { chain } = useNetwork();
  const { data: protocol } = useProtocol();
  const { data: member } = useMember();
  const { data: blockNumber } = useVersionBlockNumber();
  const { overdueTime = ZERO, overdueBlocks = ZERO } = protocol;

  const overdueUnit = isV2 ? overdueTime : overdueBlocks;

  if (member.lastRepay && member.lastRepay.gt(0)) {
    return dueDate(member.lastRepay, overdueUnit, blockNumber, chain.id);
  }

  const milliseconds = overdueUnit.mul(BlockSpeed[chain.id]);
  return formatDueDate(Number(milliseconds.toString()));
}
