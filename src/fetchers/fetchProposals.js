import { gql, request } from "graphql-request";
import { mainnet } from "wagmi/chains";

// Governance is indexed by union-ponder (mainnet Governor). Replaces the
// abandoned TheGraph subgraph.
const PONDER_URL = import.meta.env.REACT_APP_PONDER_URL;

const query = gql`
  query ($chainId: Int!, $limit: Int!) {
    proposals(limit: $limit, where: { chainId: $chainId }) {
      items {
        id
        pid
        proposer
      }
    }
  }
`;

export async function fetchProposals() {
  if (!PONDER_URL) return [];

  try {
    const resp = await request(PONDER_URL, query, { chainId: mainnet.id, limit: 999 });
    return resp?.proposals?.items || [];
  } catch (error) {
    console.error("Failed to load proposals:", error);
    return [];
  }
}
