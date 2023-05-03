import { formatUnits } from "ethers/lib/utils";

export default function format(
  n,
  digits = 2,
  rounded = true,
  stripTrailingZeros = false
) {
  if (!n) n = "0";
  return commify(Number(formatUnits(n)), digits, rounded, stripTrailingZeros);
}

export const formattedNumber = (n, digits = 2, rounded = true) => {
  return parseFloat(format(n, digits, rounded).replace(",", ""));
};

export const compactFormattedNumber = (n) => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(formatUnits(n));
};

export function commify(
  num,
  digits,
  rounded = true,
  stripTrailingZeros = false
) {
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
  let lhs = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let rhs = parts[1];

  if (digits > 0 && stripTrailingZeros) {
    if (rhs) {
      rhs = rhs.padEnd(digits, "0");
      rhs = rhs.replace(/0+$/, "");
    } else {
      rhs = "".padEnd(digits, "0");
    }

    return `${lhs}${rhs.length > 0 ? "." : ""}${rhs}`;
  }

  return rhs ? `${lhs}.${rhs}` : lhs;
}
