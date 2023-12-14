import { gql, request } from "graphql-request";

import { TheGraphUrls } from "constants";
import { mainnet } from "wagmi/chains";
import { Versions } from "providers/Version";

const query = gql`
  query {
    proposals {
      id
      pid
      proposer
    }
  }
`;

export async function fetchProposals() {
  const resp = await request(TheGraphUrls[Versions.V1][mainnet.id], query);

  return resp.proposals || [];
}
