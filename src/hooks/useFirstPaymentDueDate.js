import { useProtocol } from "providers/ProtocolData";
import { ZERO } from "constants";
import { format } from "date-fns";

export default function useFirstPaymentDueDate() {
  const { data: protocol } = useProtocol();
  const { overdueTime = ZERO } = protocol;

  const milliseconds = overdueTime.mul(1_000);

  let date = new Date();
  date.setMilliseconds(date.getMilliseconds() + Number(milliseconds));

  // we do the weird double formatting as the ' character causes the yy to not format ?!
  return `${format(date, "d LLL")} '${format(date, "yy")}`;
}
