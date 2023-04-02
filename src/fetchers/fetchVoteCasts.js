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

  const addresses = resp.voteCasts.map((item) => item.voter);
  const uniqueAddresses = addresses.filter((element, index) => {
    return addresses.indexOf(element) === index;
  });

  const addressesWithVoteCount = uniqueAddresses.map((address) => ({
    address,
    count: addresses.filter((a) => a === address).length,
  }));

  return addressesWithVoteCount.sort((a, b) => b.count - a.count);
}
