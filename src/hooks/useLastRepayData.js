import { useProtocol } from "providers/ProtocolData";
import { ZERO } from "constants";
import { useNetwork } from "wagmi";
import { useBlockTime } from "hooks/useBlockTime";
import { parseMilliseconds } from "utils/date";
import { optimism } from "wagmi/chains";

const formatTimestamp = (milliseconds) => {
  if (!milliseconds) {
    return null;
  }

  const { days, hours, minutes } = parseMilliseconds(milliseconds);

  return days > 0
    ? `${days} days`
    : hours > 0
    ? `${hours} hours`
    : minutes > 0
    ? `${minutes} minutes`
    : null;
};

export function useLastRepayData(lastRepay) {
  const { data: protocol } = useProtocol();
  const { chain } = useNetwork();

  const { overdueTime = ZERO } = protocol;

  const today = new Date();
  const lastRepayData = useBlockTime(lastRepay, chain?.id || optimism.id);
  const overdueInMilliseconds = overdueTime.mul(1000).toNumber();

  const paymentDueTimestamp =
    lastRepayData.timestamp && lastRepayData.timestamp + overdueInMilliseconds;

  return {
    ...lastRepayData,
    paymentDue: {
      overdue: today.getTime() > paymentDueTimestamp,
      timestamp: paymentDueTimestamp,
      formatted: lastRepayData.timestamp
        ? formatTimestamp(Math.abs(today.getTime() - paymentDueTimestamp))
        : "N/A",
    },
  };
}
