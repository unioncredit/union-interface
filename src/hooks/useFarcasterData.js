import { useQuery } from "@airstack/airstack-react";

const query = `
query RetrieveFarcasterData ($address: Address!) {
  Socials(
    input: {blockchain: ethereum, filter: {userAssociatedAddresses: {_eq: $address}, dappName: {_eq: farcaster}}}
  ) {
    Social {
      name: profileName
      bio: profileBio
    }
  }
}
`;

export const useFarcasterData = ({ address }) => {
  const {
    data: response,
    error,
    loading,
  } = useQuery(query, {
    address,
  });

  const data = response?.Socials?.Social?.[0] || {
    name: null,
    bio: null,
  };

  return { data, error, loading };
};
