import { parseUnits } from "viem";

import { PaymentUnitsPerYear, TOKENS, WAD, ZERO } from "constants";

export const min = (a, b) => {
  return a > b ? b : a;
};

export const percent = (n) => {
  return `${Math.floor(n * 100)}%`;
};

export const bnPercent = (n, d) => {
  if (d <= ZERO) return ZERO;
  const bps = (n * 10000n) / d;
  return Number(bps.toString()) / 10000;
};

export const toPercent = (number, digits = 0) =>
  Number(number).toLocaleString(undefined, {
    style: "percent",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });

// Converts scientific notation to a decimal formatted string
// https://stackoverflow.com/a/66072001
export function toFixed(x) {
  let sign = "";
  (x += "").charAt(0) == "-" && ((x = x.substring(1)), (sign = "-"));
  let arr = x.split(/[e]/gi);
  if (arr.length < 2) return sign + x;
  let dot = (0.1).toLocaleString().substr(1, 1),
    n = arr[0],
    exp = +arr[1],
    w = (n = n.replace(/^0+/, "")).replace(dot, ""),
    pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp,
    L = pos - w.length,
    s = "" + BigInt(w);
  w =
    exp >= 0
      ? L >= 0
        ? s + "0".repeat(L)
        : r()
      : pos <= 0
      ? "0" + dot + "0".repeat(Math.abs(pos)) + s
      : r();
  L = w.split(dot);
  if ((L[0] == 0 && L[1] == 0) || (+w == 0 && +s == 0)) w = 0; //** added 9/10/2021
  return sign + w;
  function r() {
    return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1${dot}$2`);
  }
}

export const calculateMaxBorrow = (creditLimit, originationFee) => {
  const cl = Number((creditLimit * BigInt("999999999999999")) / BigInt("1000000000000000"));
  const ofe = Number(originationFee.toString()) / 1e18;
  return BigInt(toFixed(Math.floor(cl / (ofe + 1)).toString()));
};

export const calculateMinPayment = (interest, unit) => {
  const floor = parseUnits("0.01", unit);
  const interestWithMargin = (interest * 10010n) / 10000n;
  return interestWithMargin < floor ? floor : interestWithMargin;
};

export const calculateInterestRate = (borrowRatePerUnit, chainId, unit) => {
  return (borrowRatePerUnit * PaymentUnitsPerYear[chainId]) / BigInt(10 ** (18 - unit));
};

export const calculateExpectedMinimumPayment = (
  borrowAmount,
  borrowRatePerBlock,
  overdueBlocks,
  unit
) => {
  const floor = parseUnits("0.01", unit);
  const minimumPayment = (borrowAmount * borrowRatePerBlock * overdueBlocks) / WAD[TOKENS.DAI];

  return minimumPayment < floor ? floor : minimumPayment;
};
