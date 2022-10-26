import { request, gql } from "graphql-request";

import { TransactionTypes, TheGraphUrls } from "constants";

export default async function fetchUTokenTransactions(chainId, address) {
  const query = gql`
    query ($first: Int, $account: Bytes) {
      ${TransactionTypes.BORROW}: borrows(first: $first, where: { account: $account }) {
        id
        account
        amount
        fee
        timestamp
      }
      ${TransactionTypes.REPAY}: repays(first: $first, where: { account: $account }) {
        id
        account
        amount
        timestamp
      }
    }
  `;

  const variables = {
    first: 100,
    account: address,
  };

  const resp = await request(TheGraphUrls[chainId], query, variables);

  const flattened = Object.keys(resp).reduce((acc, key) => {
    const parsed = resp[key].map((item) => {
      return {
        ...item,
        address: item.account,
        type: key,
      };
    });

    return [...acc, ...parsed];
  }, []);

  const sorted = flattened.sort((a, b) => {
    return Number(b.timestamp) - Number(a.timestamp);
  });

  return sorted;
}
