import { useProtocol } from "providers/ProtocolData";
import { ZERO } from "constants";
import { useNetwork } from "wagmi";
import { mainnet, arbitrum } from "wagmi/chains";
import { useBlockTime } from "hooks/useBlockTime";
import { parseMilliseconds } from "utils/date";

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
  const { chain: connectedChain } = useNetwork();

  const { overdueBlocks = ZERO, overdueTime = ZERO } = protocol;

  // For arbitrum we use mainnet to correctly calculate repays as it uses
  const chainId = connectedChain.id === arbitrum.id ? mainnet.id : connectedChain.id;

  const today = new Date();
  const lastRepayData = useBlockTime(lastRepay, chainId);

  const overdueInMilliseconds = (overdueBlocks.eq(ZERO) ? overdueTime : overdueBlocks)
    .mul(1000)
    .toNumber();

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
