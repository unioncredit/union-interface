import { formatUnits } from "ethers/lib/utils";

export default function format(n, digits = 2, rounded = true) {
  if (!n) n = "0";
  return commify(Number(formatUnits(n)), digits, rounded);
}

export const formattedNumber = (n, digits = 2, rounded = true) => {
  return parseFloat(format(n, digits, rounded).replace(",", ""));
};

export const compactFormattedNumber = (n) => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(formatUnits(n));
};

export function commify(num, digits, rounded = true) {
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

export function formatDetailed(number, unit = null, decimals = 4) {
  if (number === null || number === undefined) return "NaN";
  const fullNumber = Number(number);
  const fixedNumber = Number(fullNumber.toFixed(decimals));
  const integerPart = Number(fullNumber.toFixed(0));
  const fixedDecimalPart = fixedNumber - integerPart;
  const fullDecimalPart = fullNumber - integerPart;

  let result = fixedNumber;
  // if the decimal part is being rounded to zero then set lowest decimal as 1
  if (fixedDecimalPart == 0 && fullDecimalPart > 0) {
    result += Math.pow(10, -1 * decimals);
  }

  return commify(result, 2) + (unit ? " " + unit : "");
}
