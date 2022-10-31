import { ZERO } from "constants";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";

export const min = (a, b) => {
  return a.gt(b) ? b : a;
};

export const percent = (n) => {
  return `${Math.floor(n * 100)}%`;
};

export const bnPercent = (n, d) => {
  if (d.lte(ZERO)) return ZERO;
  const bps = n.mul(10000).div(d);
  return Number(bps.toString()) / 10000;
};

// https://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
export function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
}

export const calculateMaxBorrow = (creditLimit, originationFee) => {
  const cl = Number(creditLimit.mul(99999).div(100000).toString());
  const ofe = Number(originationFee.toString()) / 1e18;
  return BigNumber.from(toFixed(Math.floor(cl / (ofe + 1)).toString()));
};

export const calculateMinPayment = (interest) => {
  const floor = parseEther("0.1");
  const interestWithMargin = interest.mul(10010).div(10000);
  return interestWithMargin.lt(floor) ? floor : interestWithMargin;
};
