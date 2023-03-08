import { useNetwork } from "wagmi";
import { useProtocol } from "../providers/ProtocolData";
import { BlockSpeed, ZERO } from "constants";
import { formatDueDate } from "utils/dueDate";

export default function useFirstPaymentDueDate() {
  const { chain } = useNetwork();
  const { data: protocol } = useProtocol();
  const { overdueBlocks = ZERO } = { ...protocol };
  const milliseconds = overdueBlocks.mul(BlockSpeed[chain.id]);

  let date = new Date();
  date.setSeconds(date.getSeconds() + milliseconds / 1000);

  return date.toLocaleDateString("en-us", {
    year: "2-digit",
    month: "short",
    day: "numeric",
  });
}
