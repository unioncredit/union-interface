import { describe, expect, it } from "vitest";

import { mapActivityEvent, PONDER_CHAIN_IDS } from "fetchers/fetchActivityHistory";
import { TransactionTypes } from "constants";

// Semantics per union-ponder (src/UserManager.ts, src/UToken.ts):
// BORROW/REPAY: account = borrower. VOUCH_*: account = staker, otherAccount =
// borrower. MEMBER_REGISTERED: account = the member.
const STAKER = "0xAAA0000000000000000000000000000000000aaa";
const BORROWER = "0xBBB0000000000000000000000000000000000bbb";

const event = (type, overrides = {}) => ({
  id: "0xdeadbeef-0",
  type,
  account: STAKER,
  otherAccount: BORROWER,
  amount: "1000000",
  timestamp: "1684378581",
  ...overrides,
});

describe("mapActivityEvent", () => {
  it("maps MEMBER_REGISTERED to a register row", () => {
    const row = mapActivityEvent(event("MEMBER_REGISTERED", { otherAccount: null }), STAKER);
    expect(row).toMatchObject({
      type: TransactionTypes.REGISTER,
      applicant: STAKER,
      id: "0xdeadbeef-0",
      timestamp: "1684378581",
    });
  });

  it("maps BORROW and REPAY with the borrower as account", () => {
    const b = mapActivityEvent(event("BORROW", { account: BORROWER, otherAccount: null }), BORROWER);
    expect(b).toMatchObject({ type: TransactionTypes.BORROW, account: BORROWER, amount: "1000000" });

    const r = mapActivityEvent(event("REPAY", { account: BORROWER, otherAccount: null }), BORROWER);
    expect(r).toMatchObject({ type: TransactionTypes.REPAY, account: BORROWER });
  });

  it("maps VOUCH_REMOVED to a cancel row with staker/borrower", () => {
    const row = mapActivityEvent(event("VOUCH_REMOVED"), STAKER);
    expect(row).toMatchObject({
      type: TransactionTypes.CANCEL,
      staker: STAKER,
      borrower: BORROWER,
    });
  });

  it("renders vouches from the viewer's perspective: staker sees TRUST", () => {
    for (const type of ["VOUCH_ADDED", "VOUCH_UPDATED"]) {
      const row = mapActivityEvent(event(type), STAKER);
      expect(row).toMatchObject({
        type: TransactionTypes.TRUST,
        staker: STAKER,
        borrower: BORROWER,
      });
    }
  });

  it("renders vouches from the viewer's perspective: borrower sees TRUSTED", () => {
    const row = mapActivityEvent(event("VOUCH_ADDED"), BORROWER);
    expect(row).toMatchObject({ type: TransactionTypes.TRUSTED, staker: STAKER });
  });

  it("matches the viewer case-insensitively (checksummed vs lowercase)", () => {
    const row = mapActivityEvent(event("VOUCH_ADDED"), STAKER.toLowerCase());
    expect(row.type).toBe(TransactionTypes.TRUST);
  });

  // The row renderer looks up texts[type] and calls it — an unmapped type would
  // throw, so the mapper must drop event types the history UI does not show.
  it("drops STAKE/UNSTAKE and unknown types", () => {
    expect(mapActivityEvent(event("STAKE"), STAKER)).toBeNull();
    expect(mapActivityEvent(event("UNSTAKE"), STAKER)).toBeNull();
    expect(mapActivityEvent(event("SOMETHING_NEW"), STAKER)).toBeNull();
  });

  it("keeps the txhash-prefixed id (explorer links split on '-')", () => {
    const row = mapActivityEvent(event("BORROW"), STAKER);
    expect(row.id.split("-")[0]).toBe("0xdeadbeef");
  });
});

describe("PONDER_CHAIN_IDS", () => {
  it("covers exactly the chains union-ponder indexes", () => {
    expect(PONDER_CHAIN_IDS).toEqual([10, 8453]);
  });
});
