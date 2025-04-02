import { useAccount } from "wagmi";

import { useProtocol } from "providers/ProtocolData";
import { ZERO } from "constants";
import { useBlockTime } from "hooks/useBlockTime";
import { parseMilliseconds } from "utils/date";
import { base } from "viem/chains";

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
  const { chain } = useAccount();

  const { overdueTime = ZERO } = protocol;

  const today = new Date();
  const lastRepayData = useBlockTime(lastRepay, chain?.id || base.id);
  const overdueInMilliseconds = Number(overdueTime * 1000n);

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
