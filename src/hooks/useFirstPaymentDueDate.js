import { useNetwork } from "wagmi";
import { useProtocol } from "providers/ProtocolData";
import { BlockSpeed, ZERO } from "constants";
import { format } from "date-fns";

export default function useFirstPaymentDueDate() {
  const { chain } = useNetwork();
  const { data: protocol } = useProtocol();
  const { overdueBlocks = ZERO } = protocol;

  const milliseconds = overdueBlocks.mul(BlockSpeed[chain.id]);

  let date = new Date();
  date.setMilliseconds(date.getMilliseconds() + Number(milliseconds));

  // we do the weird double formatting as the ' character causes the yy to not format ?!
  return `${format(date, "d LLL")} '${format(date, "yy")}`;
}
