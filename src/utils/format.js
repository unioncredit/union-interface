import { formatUnits } from "ethers/lib/utils";

export default function format(n, digits = 2) {
  if (!n) n = "0";
  return commify(Number(formatUnits(n)), digits);
}

function commify(num, digits) {
  num = Number(num);
  num = num <= 0 ? 0 : num;

  if (!num) return `0${digits > 0 ? "." : ""}${"".padEnd(digits, "0")}`;

  const numStr = Number(num).toLocaleString("en", {
    useGrouping: false,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  const parts = numStr.split(".");

  const lhs = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (digits > 0 && parts[1]) {
    return `${lhs}.${parts[1]}`;
  }

  return lhs;
}
