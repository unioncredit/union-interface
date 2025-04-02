import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { gql, request } from "graphql-request";
import { useReadContracts } from "wagmi";
import { mainnet } from "wagmi/chains";

import { ProposalState, TheGraphUrls } from "constants";
import useContract from "hooks/useContract";
import { chunk, flatten } from "lodash";
import { Versions } from "./Version";

const GovernanceContext = createContext({});

export const useGovernance = () => useContext(GovernanceContext);

/* --------------------------------------------------------
  Governance Proposals History
-------------------------------------------------------- */

const proposalHistoryQuery = gql`
  query ProposalUpdates($where: ProposalUpdate_filter) {
    proposalUpdates(where: $where) {
      id
      proposer
      action
      timestamp
    }
  }
`;

async function getProposalHistory(pid) {
  const variables = {
    where: {
      pid: pid.toString(),
    },
  };

  const resp = await request(
    TheGraphUrls[Versions.V1][mainnet.id],
    proposalHistoryQuery,
    variables
  );

  return resp.proposalUpdates;
}

/* --------------------------------------------------------
  Governance Proposals
-------------------------------------------------------- */

const proposalsQuery = gql`
  {
    proposals(first: 999) {
      id
      pid
      proposer
      description
      targets
      signatures
      calldatas
    }
  }
`;

const selectProposals = (data) => {
  return chunk(
    data.map((d) => d.result),
    2
  ).map(([proposal, state]) => {
    if (!proposal) return {};

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
      // Computed values
      percentageFor:
        Number(
          (
            (proposal.forVotes * 1000) /
            (proposal.againstVotes + proposal.forVotes + proposal.abstainVotes)
          ).toString()
        ) / 1000,
    };
  });
};

function useProposals() {
  const [proposals, setProposals] = useState([]);

  const governorContract = useContract("governor", mainnet.id, Versions.V1);

  const getProposals = useCallback(async () => {
    const resp = await request(TheGraphUrls[Versions.V1][mainnet.id], proposalsQuery);
    const proposals = resp.proposals;

    return Promise.all(
      proposals.map(async (proposal) => {
        const history = await getProposalHistory(proposal.pid);
        return { ...proposal, history };
      })
    );
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
