import { BlockSpeed, ZERO } from "constants";
import { parseMilliseconds } from "utils/date";
import { format } from "date-fns";

export const NoPaymentLabel = "No payment due";
const OverdueLabel = "Payment overdue";

function dueDateToMilliseconds(lastRepay, overdueTime, blockNumber, chainId) {
  if (!lastRepay || !overdueTime || !blockNumber || !chainId || lastRepay.lte(ZERO)) {
    return null;
  }

  const milliseconds = lastRepay.add(overdueTime).sub(blockNumber).mul(BlockSpeed[chainId]);

  return Number(milliseconds.toString());
}

export const formatDueDate = (milliseconds) => {
  const { days, hours, minutes } = parseMilliseconds(milliseconds);

  if (days + hours + minutes <= 0) return OverdueLabel;

  return `${days > 0 ? `${days}d` : ""} ${hours > 0 ? `${hours}h` : ""}`;
};

export default function dueDate(lastRepay, overdueTime, blockNumber, chainId) {
  const milliseconds = dueDateToMilliseconds(lastRepay, overdueTime, blockNumber, chainId);

  return milliseconds === null ? NoPaymentLabel : formatDueDate(milliseconds);
}

export const dueOrOverdueDate = (lastRepay, overdueTime, blockNumber, chainId) => {
  const milliseconds = dueDateToMilliseconds(lastRepay, overdueTime, blockNumber, chainId);

  if (milliseconds === null) {
    return {
      relative: NoPaymentLabel,
    };
  }

  let date = new Date();
  date.setMilliseconds(date.getMilliseconds() + milliseconds);

  return {
    relative: formatDueDate(Math.abs(milliseconds)),
    absolute: format(date, "do MMMM yyyy"),
    overdue: milliseconds < 0,
  };
};
