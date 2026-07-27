import { gql, request } from "graphql-request";
import { mainnet } from "wagmi/chains";

// A voter's cast votes, served by union-ponder's voteCast table (mainnet
// Governor events). Replaces the abandoned TheGraph subgraph. Field shapes are
// unchanged: proposalId/weight/timestamp arrive as strings, support as an int.
const PONDER_URL = import.meta.env.REACT_APP_PONDER_URL;

const query = gql`
  query ($voter: String!, $chainId: Int!, $limit: Int!) {
    voteCasts(
      where: { voter: $voter, chainId: $chainId }
      orderBy: "timestamp"
      orderDirection: "asc"
      limit: $limit
    ) {
      items {
        id
        proposalId
        reason
        support
        timestamp
        voter
        weight
      }
    }
  }
`;

export async function fetchUserVotes(address) {
  if (!PONDER_URL || !address) return [];

  try {
    const resp = await request(PONDER_URL, query, {
      voter: address.toLowerCase(),
      chainId: mainnet.id,
      limit: 1000,
    });
    return resp?.voteCasts?.items || [];
  } catch (error) {
    console.error("Failed to load user votes:", error);
    return [];
  }
}
