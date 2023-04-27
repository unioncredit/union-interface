import { useNetwork } from "wagmi";
import { useProtocol } from "providers/ProtocolData";
import { BlockSpeed, ZERO } from "constants";
import { formatDueDate } from "utils/dueDate";
import { useVersion } from "providers/Version";

export default function useFirstPaymentDueDate() {
  const { isV2 } = useVersion();
  const { chain } = useNetwork();
  const { data: protocol } = useProtocol();
  const { overdueTime = ZERO, overdueBlocks = ZERO } = protocol;

  const milliseconds = (isV2 ? overdueTime : overdueBlocks).mul(
    BlockSpeed[chain.id]
  );

  return formatDueDate(Number(milliseconds.toString()));
}
