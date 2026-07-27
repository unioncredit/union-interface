import { describe, expect, it } from "vitest";

import { selectVoucher } from "providers/VouchersData";
import { selectVouchee } from "providers/VoucheesData";
import { selectProposals } from "providers/GovernanceData";
import { Versions } from "providers/Version";
import { ZERO } from "constants";

// wagmi's `allowFailure` default yields `result: undefined` for any sub-call that
// reverts or fails. These selectors run inside react-query's `select`, so a throw
// there errors the WHOLE query — one bad row used to wipe the entire contacts list.
const V2_INFO = { voucher: { locked: 10n, trust: 20n, vouch: 30n } };
const V1_INFO = { lockedStake: 10n, trustAmount: 20n, vouchingAmount: 30n };

describe("selectVoucher (vouchers list)", () => {
  it("maps a healthy V2 row", () => {
    const r = selectVoucher(Versions.V2)([true, 500n, V2_INFO]);
    expect(r).toMatchObject({ checkIsMember: true, stakedBalance: 500n, locking: 10n, trust: 20n, vouch: 30n });
  });

  it("maps a healthy V1 row", () => {
    const r = selectVoucher(Versions.V1)([true, 500n, V1_INFO]);
    expect(r).toMatchObject({ locking: 10n, trust: 20n, vouch: 30n });
  });

  // Regression: the V2 path did `info.voucher.locked` with an `info = []` default,
  // so `[].voucher` was undefined and this threw, erroring the whole query.
  it("degrades to zeros when the related-info sub-call failed (V2)", () => {
    expect(() => selectVoucher(Versions.V2)([true, 500n, undefined])).not.toThrow();
    const r = selectVoucher(Versions.V2)([true, 500n, undefined]);
    expect(r).toMatchObject({ checkIsMember: true, stakedBalance: 500n, locking: ZERO, trust: ZERO, vouch: ZERO });
  });

  it("degrades to zeros when the related-info sub-call failed (V1)", () => {
    expect(() => selectVoucher(Versions.V1)([true, 500n, undefined])).not.toThrow();
    expect(selectVoucher(Versions.V1)([true, 500n, undefined])).toMatchObject({ locking: ZERO });
  });

  it("survives an entirely failed row", () => {
    expect(() => selectVoucher(Versions.V2)([])).not.toThrow();
    expect(() => selectVoucher(Versions.V2)(undefined)).not.toThrow();
    expect(selectVoucher(Versions.V2)([])).toMatchObject({ checkIsMember: false, stakedBalance: ZERO });
  });
});

describe("selectVouchee (vouchees list)", () => {
  it("maps a healthy V2 row", () => {
    const r = selectVouchee(Versions.V2)([true, V2_INFO, false, 5n, 100n]);
    expect(r).toMatchObject({ isMember: true, locking: 10n, trust: 20n, vouch: 30n, isOverdue: false, interest: 5n, lastRepay: 100n });
  });

  // Regression: read `data[1].voucher.locked` with no guard at all.
  it("degrades to zeros when the related-info sub-call failed", () => {
    expect(() => selectVouchee(Versions.V2)([true, undefined, false, 5n, 100n])).not.toThrow();
    expect(selectVouchee(Versions.V2)([true, undefined, false, 5n, 100n])).toMatchObject({
      locking: ZERO,
      trust: ZERO,
      vouch: ZERO,
    });
  });

  it("survives an entirely failed row", () => {
    expect(() => selectVouchee(Versions.V1)([])).not.toThrow();
    expect(() => selectVouchee(Versions.V2)(undefined)).not.toThrow();
  });
});

describe("selectProposals (governance vote tallies)", () => {
  const proposal = (forV, againstV, abstainV) => ({
    id: 1n,
    proposer: "0x1",
    eta: 0n,
    startBlock: 1n,
    endBlock: 2n,
    forVotes: forV,
    againstVotes: againstV,
    abstainVotes: abstainV,
    canceled: false,
    executed: false,
  });
  const wrap = (p, state = 1) => [{ result: p }, { result: state }];

  // Regression: `proposal.forVotes * 1000` mixed BigInt with a Number literal and
  // threw "Cannot mix BigInt and other types" inside select, so the whole
  // proposals query errored and no tallies rendered.
  it("computes percentageFor from BigInt tallies without throwing", () => {
    expect(() => selectProposals(wrap(proposal(50n, 50n, 0n)))).not.toThrow();
    expect(selectProposals(wrap(proposal(50n, 50n, 0n)))[0].percentageFor).toBe(0.5);
    expect(selectProposals(wrap(proposal(75n, 25n, 0n)))[0].percentageFor).toBe(0.75);
    expect(selectProposals(wrap(proposal(1n, 0n, 0n)))[0].percentageFor).toBe(1);
  });

  it("handles wei-scale tallies (where Number would lose precision)", () => {
    const forV = 1_000_000n * 10n ** 18n;
    const againstV = 3_000_000n * 10n ** 18n;
    expect(selectProposals(wrap(proposal(forV, againstV, 0n)))[0].percentageFor).toBe(0.25);
  });

  it("returns 0 instead of dividing by zero when a proposal has no votes", () => {
    expect(selectProposals(wrap(proposal(0n, 0n, 0n)))[0].percentageFor).toBe(0);
  });

  it("still maps the proposal fields", () => {
    const [p] = selectProposals(wrap(proposal(1n, 1n, 0n), 4));
    expect(p).toMatchObject({ pid: 1n, forVotes: 1n, state: 4, status: "succeeded" });
  });
});
