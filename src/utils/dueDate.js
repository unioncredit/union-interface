import { ZERO } from "constants";
import { BlockSpeed } from "constants";

const NoPaymentLabel = "No payment due";

function parseMs(milliseconds) {
  if (typeof milliseconds !== "number") {
    throw new TypeError("Expected a number");
  }

  return {
    days: Math.trunc(milliseconds / 86400000),
    hours: Math.trunc(milliseconds / 3600000) % 24,
    minutes: Math.trunc(milliseconds / 60000) % 60,
    seconds: Math.trunc(milliseconds / 1000) % 60,
    milliseconds: Math.trunc(milliseconds) % 1000,
    microseconds: Math.trunc(milliseconds * 1000) % 1000,
    nanoseconds: Math.trunc(milliseconds * 1e6) % 1000,
  };
}

const formatDueDate = (milliseconds) => {
  const { days, hours, minutes } = parseMs(milliseconds);

  if (days + hours + minutes <= 0) return NoPaymentLabel;

  return `in ${days > 0 ? `${days}d` : ""} ${hours > 0 ? `${hours}h` : ""} ${
    minutes > 0 ? `${minutes}m` : ""
  }`;
};

export default function dueDate(
  lastRepay,
  overdueBlocks,
  blockNumber,
  chainId
) {
  if (lastRepay.lte(ZERO)) return NoPaymentLabel;

  const milliseconds = lastRepay
    .add(overdueBlocks)
    .sub(blockNumber)
    .mul(BlockSpeed[chainId]);

  return formatDueDate(Number(milliseconds.toString()));
}
