import { ZERO } from "constants";

export const min = (a, b) => {
  return a.gt(b) ? a : b;
};

export const percent = (n) => {
  return `${Math.floor(n * 100)}%`;
};

export const bnPercent = (n, d) => {
  if (d.lte(ZERO)) return ZERO;
  const bps = n.mul(10000).div(d);
  return Number(bps.toString()) / 10000;
};
