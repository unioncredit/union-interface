import { useNetwork } from "wagmi";
import { useProtocol } from "providers/ProtocolData";
import { BlockSpeed, ZERO } from "constants";
import { useVersion } from "providers/Version";
import { format } from "date-fns";

export default function useFirstPaymentDueDate() {
  const { isV2 } = useVersion();
  const { chain } = useNetwork();
  const { data: protocol } = useProtocol();
  const { overdueTime = ZERO, overdueBlocks = ZERO } = protocol;

  const milliseconds = isV2 ? overdueTime.mul(1000) : overdueBlocks.mul(BlockSpeed[chain.id]);

  let date = new Date();
  date.setSeconds(date.getSeconds() + milliseconds / 1000);

  // we do the weird double formatting as the ' character causes the yy to not format ?!
  return `${format(date, "d LLL")} '${format(date, "yy")}`;
}
