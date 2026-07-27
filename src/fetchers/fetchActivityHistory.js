import { request, gql } from "graphql-request";

import { TransactionTypes } from "constants";

// The union-ponder indexer (REACT_APP_PONDER_URL) — the same endpoint the
// leaderboards already query via Apollo. Replaces the abandoned TheGraph
// subgraphs that previously served transaction history and now return
// "deployment does not exist".
const PONDER_URL = import.meta.env.REACT_APP_PONDER_URL;

// Chains indexed by union-ponder (optimism, base). V1 chains have no indexer
// coverage; callers get an empty history there, matching the old fetchers'
// behaviour when a chain had no subgraph URL.
export const PONDER_CHAIN_IDS = [10, 8453];

const query = gql`
  query ($account: String!, $chainId: Int!, $limit: Int!) {
    activityEvents(
      limit: $limit
      orderBy: "timestamp"
      orderDirection: "desc"
      where: { AND: [{ chainId: $chainId }, { OR: [{ account: $account }, { otherAccount: $account }] }] }
    ) {
      items {
        id
        type
        account
        otherAccount
        amount
        timestamp
      }
    }
  }
`;

const eq = (a, b) => a && b && a.toLowerCase() === b.toLowerCase();

/**
 * Map a ponder activityEvent to the row shape TransactionHistoryRow renders.
 * Returns null for event types the history UI does not display (STAKE/UNSTAKE)
 * — the row renderer throws on unknown types, so they must be dropped here.
 *
 * Ponder event semantics (see union-ponder src/UserManager.ts, src/UToken.ts):
 *   BORROW / REPAY          account = borrower
 *   VOUCH_ADDED / _UPDATED  account = staker, otherAccount = borrower
 *   VOUCH_REMOVED           account = staker, otherAccount = borrower
 *   MEMBER_REGISTERED       account = the new member
 *
 * `id` is "<txHash>-<txIndex>", so the row's `id.split("-")[0]` explorer link
 * keeps working (same convention as the old subgraph ids).
 */
export const mapActivityEvent = (event, viewer) => {
  const { id, type, account, otherAccount, amount, timestamp } = event;
  const common = { id, amount, timestamp };

  switch (type) {
    case "MEMBER_REGISTERED":
      return { ...common, type: TransactionTypes.REGISTER, applicant: account };
    case "BORROW":
      return { ...common, type: TransactionTypes.BORROW, account, address: account };
    case "REPAY":
      return { ...common, type: TransactionTypes.REPAY, account, address: account };
    case "VOUCH_REMOVED":
      return { ...common, type: TransactionTypes.CANCEL, staker: account, borrower: otherAccount };
    case "VOUCH_ADDED":
    case "VOUCH_UPDATED":
      // Same event, rendered from the viewer's perspective: as the staker it is
      // "Trusted <borrower>", as the borrower it is "Trusted by <staker>".
      return {
        ...common,
        type: eq(viewer, account) ? TransactionTypes.TRUST : TransactionTypes.TRUSTED,
        staker: account,
        borrower: otherAccount,
        address: otherAccount,
      };
    default:
      return null;
  }
};

export default async function fetchActivityHistory(chainId, address) {
  if (!PONDER_URL || !address || !PONDER_CHAIN_IDS.includes(chainId)) return [];

  const resp = await request(PONDER_URL, query, {
    account: address.toLowerCase(),
    chainId,
    limit: 1000,
  });

  return (resp?.activityEvents?.items || [])
    .map((event) => mapActivityEvent(event, address))
    .filter(Boolean);
}
