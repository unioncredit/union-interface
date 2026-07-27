import { request, gql } from "graphql-request";

import { PONDER_CHAIN_IDS } from "fetchers/fetchActivityHistory";

// Borrow/repay/registration history for useCreditData, served by the
// union-ponder indexer. Replaces @unioncredit/data's fetchAccountBorrows /
// fetchAccountRepays / fetchAccountMembershipApplication, which read the
// abandoned TheGraph subgraphs — and whose global `config.set("chainId", ...)`
// raced when two hooks fetched different chains concurrently. Passing chainId
// per-query removes that shared state entirely.
const PONDER_URL = import.meta.env.REACT_APP_PONDER_URL;

const query = gql`
  query ($account: String!, $chainId: Int!, $limit: Int!) {
    borrows(
      limit: $limit
      orderBy: "timestamp"
      orderDirection: "asc"
      where: { borrower: $account, chainId: $chainId }
    ) {
      items {
        id
        amount
        fee
        timestamp
      }
    }
    repays(
      limit: $limit
      orderBy: "timestamp"
      orderDirection: "asc"
      where: { borrower: $account, chainId: $chainId }
    ) {
      items {
        id
        amount
        timestamp
      }
    }
    accountRegistrations(limit: 1, where: { account: $account, chainId: $chainId }) {
      items {
        timestamp
      }
    }
  }
`;

export default async function fetchCreditHistory(chainId, address) {
  const empty = { borrows: [], repays: [], application: null };
  if (!PONDER_URL || !address || !PONDER_CHAIN_IDS.includes(chainId)) return empty;

  const resp = await request(PONDER_URL, query, {
    account: address.toLowerCase(),
    chainId,
    limit: 1000,
  });

  return {
    borrows: resp?.borrows?.items || [],
    repays: resp?.repays?.items || [],
    application: resp?.accountRegistrations?.items?.[0] || null,
  };
}
