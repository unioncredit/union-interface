import { gql, request } from "graphql-request";

import { TheGraphUrls } from "constants";
import { mainnet } from "wagmi/chains";
import { Versions } from "providers/Version";

const query = gql`
  query ($first: Int!, $voter: Bytes!) {
    voteCasts(where: { voter: $voter }, first: $first) {
      id
      proposalId
      reason
      support
      timestamp
      voter
      weight
    }
  }
`;

export async function fetchUserVotes(address) {
  const variables = {
    first: 1000,
    voter: address,
  };

  const resp = await request(TheGraphUrls[Versions.V1][mainnet.id], query, variables);

  return resp.voteCasts || [];
}
