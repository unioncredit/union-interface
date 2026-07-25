import { describe, expect, it } from "vitest";
import { parseUnits } from "viem";

import format, { formattedNumber } from "utils/format";

const usdc = (s) => parseUnits(s, 6); // USDC / 6dp (Base, Optimism)
const dai = (s) => parseUnits(s, 18); // DAI / UNION / 18dp

describe("formattedNumber", () => {
  it("is exact below the first group separator", () => {
    expect(formattedNumber(usdc("1"), "USDC")).toBe(1);
    expect(formattedNumber(usdc("100.5"), "USDC")).toBe(100.5);
    expect(formattedNumber(usdc("999.99"), "USDC")).toBe(999.99);
  });

  it("is exact with one group separator", () => {
    expect(formattedNumber(usdc("1500"), "USDC")).toBe(1500);
    expect(formattedNumber(usdc("999999.99"), "USDC")).toBe(999999.99);
  });

  // Regression: `format` returns a commified string and formattedNumber used
  // `.replace(",", "")`, which strips only the FIRST comma — "1,234,567.89"
  // became "1234,567.89" and parseFloat truncated it to 1234 (~1000x low).
  // These are the values that were broken; everything under 1,000,000 was fine.
  it("does not truncate at or above 1,000,000 (multiple group separators)", () => {
    expect(formattedNumber(usdc("1000000"), "USDC")).toBe(1000000);
    expect(formattedNumber(usdc("1234567.89"), "USDC")).toBe(1234567.89);
    expect(formattedNumber(usdc("5000000"), "USDC")).toBe(5000000);
    expect(formattedNumber(dai("1234567.89"), "DAI")).toBe(1234567.89);
    // Billions: three separators — would have collapsed to 1 before the fix.
    expect(formattedNumber(dai("1000000000"), "UNION")).toBe(1000000000);
  });

  // Guards the ProfileSidebar / ProfileCurrentBalances bug: those call sites
  // passed a number into the `token` slot (arg-order slip), so the amount was
  // scaled by the wrong number of decimals and collapsed to 0, which made the
  // DistributionBar render empty. The token argument is what keeps 6dp markets
  // from being read as 18dp.
  it("scales by the token's decimals, not a default", () => {
    // Same on-chain magnitude, different token decimals.
    expect(formattedNumber(usdc("1500"), "USDC")).toBe(1500);
    expect(formattedNumber(dai("1500"), "DAI")).toBe(1500);

    // A 6dp amount read as 18dp (the old `formattedNumber(owed)` default)
    // underflows to 0 — this is what blanked the profile bars.
    expect(formattedNumber(usdc("1500"), "DAI")).toBe(0);

    // An omitted/invalid token also yields 0 rather than the real value, so
    // call sites must always pass it.
    expect(formattedNumber(usdc("1500"))).toBe(0);
    expect(formattedNumber(usdc("1500"), 2, false)).toBe(0);
  });

  it("handles zero and dust", () => {
    expect(formattedNumber(0n, "USDC")).toBe(0);
    expect(formattedNumber(undefined, "USDC")).toBe(0);
  });
});

describe("format", () => {
  it("commifies and respects token decimals", () => {
    expect(format(usdc("1234567.89"), "USDC")).toBe("1,234,567.89");
    expect(format(dai("1500"), "DAI")).toBe("1,500.00");
  });

  it("truncates instead of rounding when rounded=false", () => {
    // Used for "available to borrow" style figures that must not round up.
    expect(format(usdc("100.999"), "USDC", 2, false)).toBe("100.99");
    expect(format(usdc("100.999"), "USDC", 2, true)).toBe("101.00");
  });
});
