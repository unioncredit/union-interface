import { formatUnits } from "viem";

import { DUST_THRESHOLD, UNIT, ZERO } from "constants";
import { normalize } from "viem/ens";

export default function format(
  n,
  token = "DAI",
  digits = 2,
  rounded = true,
  stripTrailingZeros = false,
  formatDust = true
) {
  if (!n) n = "0";
  // An unknown token means unknown decimals — render 0 rather than a value
  // that is wrong by orders of magnitude. (Was previously an accident of
  // formatUnits(n, undefined); viem >=2.55 formats real digits instead.)
  if (UNIT[token] === undefined) n = "0";
  if (formatDust && typeof n === "bigint" && n < DUST_THRESHOLD[token] && n > ZERO) return "<0.01";
  return commify(Number(formatUnits(n, UNIT[token] ?? 0)), digits, rounded, stripTrailingZeros);
}

export const formattedNumber = (n, token, digits = 2, rounded = true) => {
  // Strip ALL group separators: `format` returns e.g. "1,234,567.89", and
  // replacing only the first comma left "1234,567.89", which parseFloat
  // truncates to 1234 (~1000x low) for every value >= 1,000,000.
  return parseFloat(format(n, token, digits, rounded, false, false).replace(/,/g, ""));
};

export const compactFormattedNumber = (n, token) => {
  if (UNIT[token] === undefined) return "0";
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(Number(formatUnits(n, UNIT[token])));
};

export function commify(num, digits, rounded = true, stripTrailingZeros = false) {
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

export const formatScientific = (value, unit, digits = 2) => {
  if (!value) {
    value = 0;
  }

  // Parsed JSON response formats the bigints in scientific notation, we need to
  // expand into its full form.
  const expanded = expandToString(value);
  const formatted = commify(formatUnits(expanded, unit), digits);
  if (value > 0 && formatted === "0.0000") {
    return "<0.0001";
  }

  return formatted;
};

// Takes an int/float value and casts it to string, helps to remove scientific notation
export const expandToString = (value) => {
  return value.toLocaleString("fullwide", { useGrouping: false });
};

export const tryNormalize = (ens) => {
  try {
    return normalize(ens);
  } catch {
    return ens;
  }
}