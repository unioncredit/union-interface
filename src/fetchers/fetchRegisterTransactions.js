import { request, gql } from "graphql-request";

import { TheGraphUrls, TransactionTypes } from "constants";

const query = gql`
  query (
    $first: Int, 
    $memberApplicationsFilter: MemberApplication_filter,
  ) {
    ${TransactionTypes.REGISTER}: memberApplications(first: $first, where: $memberApplicationsFilter) {
      id
      applicant
      timestamp
    }
  }
`;

export default async function fetchUserTransactions(chainId, account) {
  const variables = {
    first: 100,
    memberApplicationsFilter: {
      applicant: account,
    },
  };

  const resp = await request(TheGraphUrls[chainId], query, variables);

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
