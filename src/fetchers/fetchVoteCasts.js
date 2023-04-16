import { gql, request } from "graphql-request";

import { TheGraphUrls } from "constants";

const query = gql`
  query ($first: Int!) {
    voteCasts(orderBy: weight, orderDirection: desc, first: $first) {
      voter
    }
  }
`;

export default async function fetchVoteCasts(chainId) {
  const variables = {
    first: 200,
  };

  const resp = await request(TheGraphUrls[chainId], query, variables);

  return resp.voteCasts.map((item) => item.voter);
}
