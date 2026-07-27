import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { gql, request } from "graphql-request";
import { useReadContracts } from "wagmi";
import { mainnet } from "wagmi/chains";

import { ProposalState } from "constants";
import useContract from "hooks/useContract";
import { chunk, flatten } from "lodash";
import { Versions } from "./Version";

const GovernanceContext = createContext({});

export const useGovernance = () => useContext(GovernanceContext);

// Governance is indexed by union-ponder (mainnet Governor events). Replaces the
// abandoned TheGraph subgraph that made every governance query throw
// "deployment does not exist".
const PONDER_URL = import.meta.env.REACT_APP_PONDER_URL;

/* --------------------------------------------------------
  Governance Proposals History
-------------------------------------------------------- */

const proposalHistoryQuery = gql`
  query ($chainId: Int!, $limit: Int!) {
    proposalUpdates(
      where: { chainId: $chainId }
      orderBy: "timestamp"
      orderDirection: "asc"
      limit: $limit
    ) {
      items {
        id
        pid
        proposer
        action
        timestamp
      }
    }
  }
`;

// One request for every proposal's lifecycle rows, grouped by pid — replaces
// the previous per-proposal query (an N+1 against the subgraph).
async function getProposalHistories() {
  const resp = await request(PONDER_URL, proposalHistoryQuery, {
    chainId: mainnet.id,
    limit: 1000,
  });

  return (resp?.proposalUpdates?.items || []).reduce((acc, update) => {
    const key = String(update.pid);
    return { ...acc, [key]: [...(acc[key] || []), update] };
  }, {});
}

/* --------------------------------------------------------
  Governance Proposals
-------------------------------------------------------- */

const proposalsQuery = gql`
  query ($chainId: Int!, $limit: Int!) {
    proposals(limit: $limit, where: { chainId: $chainId }) {
      items {
        id
        pid
        proposer
        description
        targets
        signatures
        calldatas
      }
    }
  }
`;

export const selectProposals = (data) => {
  return chunk(
    data.map((d) => d.result),
    2
  ).map(([proposal, state]) => {
    if (!proposal) return {};

    // Vote tallies come back as uint256 -> BigInt.
    const forVotes = proposal.forVotes ?? 0n;
    const againstVotes = proposal.againstVotes ?? 0n;
    const abstainVotes = proposal.abstainVotes ?? 0n;
    const totalVotes = forVotes + againstVotes + abstainVotes;

    return {
      // proposal(uint256 pid)
      pid: proposal.id,
      proposer: proposal.proposer,
      eta: proposal.eta,
      startBlock: proposal.startBlock,
      endBlock: proposal.endBlock,
      forVotes: proposal.forVotes,
      againstVotes: proposal.againstVotes,
      abstainVotes: proposal.abstainVotes,
      canceled: proposal.canceled,
      executed: proposal.executed,
      // state(uint256 pid)
      state,
      status: ProposalState[state],
      // Computed values — kept entirely in BigInt.
      //
      // This was `proposal.forVotes * 1000`, mixing a BigInt with a Number
      // literal, which throws "Cannot mix BigInt and other types". Because it ran
      // inside react-query's `select`, the throw errored the whole proposals query
      // and no on-chain state or vote tallies rendered whenever a proposal existed.
      // Scaling by 10000n also guards division by zero on a proposal with no votes.
      percentageFor: totalVotes > 0n ? Number((forVotes * 10000n) / totalVotes) / 10000 : 0,
    };
  });
};

function useProposals() {
  const [proposals, setProposals] = useState([]);

  const governorContract = useContract("governor", mainnet.id, Versions.V1);

  const getProposals = useCallback(async () => {
    if (!PONDER_URL) return [];

    try {
      const [resp, histories] = await Promise.all([
        request(PONDER_URL, proposalsQuery, { chainId: mainnet.id, limit: 999 }),
        getProposalHistories(),
      ]);

      return (resp?.proposals?.items || []).map((proposal) => ({
        ...proposal,
        history: histories[String(proposal.pid)] || [],
      }));
    } catch (error) {
      // A failed governance fetch must not surface as an unhandled rejection.
      console.error("Failed to load proposals:", error);
      return [];
    }
  }, []);

  const contracts = flatten(
    proposals.map((proposal) => [
      {
        ...governorContract,
        functionName: "proposals",
        args: [proposal.pid],
        chainId: mainnet.id,
      },
      {
        ...governorContract,
        functionName: "state",
        args: [proposal.pid],
        chainId: mainnet.id,
      },
    ])
  );

  const { data: proposalsMetadata } = useReadContracts({
    contracts,
    query: {
      select: selectProposals,
      enabled: proposals?.length > 0,
    },
  });

  useEffect(() => {
    (async function () {
      const data = await getProposals();
      setProposals(data);
    })();
  }, [getProposals]);

  const data = proposals.map((proposal, i) => ({
    ...proposal,
    ...proposalsMetadata?.[i],
    hash: proposal.id.split("-")[0],
  }));

  return { data, refetch: getProposals };
}

/* --------------------------------------------------------
  Provider Component
-------------------------------------------------------- */

export default function GovernanceData({ children }) {
  const { data: proposals } = useProposals();

  return <GovernanceContext.Provider value={{ proposals }}>{children}</GovernanceContext.Provider>;
}
