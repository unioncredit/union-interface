import { gql, request } from "graphql-request";
import { mainnet } from "wagmi/chains";

// Voter list for the delegates leaderboard, served by union-ponder's voteCast
// table (mainnet Governor events). Replaces the abandoned TheGraph subgraph.
// Returns one entry per vote cast (duplicates intended — callers derive
// per-voter vote counts from repetition), ordered by vote weight descending.
const PONDER_URL = import.meta.env.REACT_APP_PONDER_URL;

const query = gql`
  query ($chainId: Int!, $limit: Int!) {
    voteCasts(
      orderBy: "weight"
      orderDirection: "desc"
      limit: $limit
      where: { chainId: $chainId }
    ) {
      items {
        voter
      }
    }
  }
`;

export default async function fetchVoteCasts(version, chainId) {
  // Governance only exists on mainnet; other chains have no vote casts.
  if (!PONDER_URL || chainId !== mainnet.id) return [];

  try {
    const resp = await request(PONDER_URL, query, { chainId: mainnet.id, limit: 200 });
    return (resp?.voteCasts?.items || []).map((item) => item.voter);
  } catch (error) {
    console.error("Failed to load vote casts:", error);
    return [];
  }
}
