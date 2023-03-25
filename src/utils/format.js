import { formatUnits } from "ethers/lib/utils";

export default function format(n, digits = 2, rounded = true) {
  if (!n) n = "0";
  return commify(Number(formatUnits(n)), digits, rounded);
}

export const formattedNumber = (n, digits = 2, rounded = true) => {
  return parseFloat(format(n, digits, rounded));
};

function commify(num, digits, rounded = true) {
  num = Number(num);
  num = num <= 0 ? 0 : num;

  if (!num) return `0${digits > 0 ? "." : ""}${"".padEnd(digits, "0")}`;

  let numStr = Number(num).toLocaleString("en", {
    useGrouping: false,
    minimumFractionDigits: rounded ? digits : 18,
    maximumFractionDigits: rounded ? digits : 18,
  });

  if (!rounded) {
    const pattern = new RegExp("^-?\\d+(?:\\.\\d{0," + digits + "})?");
    numStr = numStr.match(pattern)[0];
  }

  const parts = numStr.split(".");

  const lhs = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (digits > 0 && parts[1]) {
    return `${lhs}.${parts[1]}`;
  }

  return lhs;
}
