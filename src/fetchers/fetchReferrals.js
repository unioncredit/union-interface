import { gql, request } from "graphql-request";

import { TheGraphUrls } from "constants";

const query = gql`
  query ($first: Int, $referralsFilter: Referral_filter) {
    referrals(first: $first, where: $referralsFilter) {
      id
      rebate
      timestamp
    }
  }
`;

export default async function fetchReferrals(version, chainId, account) {
  const variables = {
    first: 100,
    referralsFilter: {
      referrer: account,
    },
  };
  if (!TheGraphUrls[version][chainId]) return [];
  const resp = await request(TheGraphUrls[version][chainId], query, variables);

  const flattened = Object.keys(resp).reduce((acc, key) => {
    const parsed = resp[key].map((item) => ({
      ...item,
      type: key,
    }));

    return [...acc, ...parsed];
  }, []);

  const sorted = flattened.sort((a, b) => {
    return Number(b.timestamp) - Number(a.timestamp);
  });

  return sorted;
}
