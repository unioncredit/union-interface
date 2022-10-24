import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { request, gql } from "graphql-request";
import { chain, useContractReads } from "wagmi";

import { TheGraphUrls } from "constants";
import useContract from "hooks/useContract";
import { chunk, flatten } from "lodash";
import { ProposalState } from "constants";

const GovernanceContext = createContext({});

export const useGovernance = () => useContext(GovernanceContext);

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
  return chunk(data, 2).map(([proposal, state]) => {
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
          proposal.forVotes
            .mul("1000")
            .div(
              proposal.againstVotes
                .add(proposal.forVotes)
                .add(proposal.abstainVotes)
            )
            .toString()
        ) / 1000,
    };
  });
};

function useProposals() {
  const [proposals, setProposals] = useState([]);

  const governorContract = useContract("governor");

  const getProposals = useCallback(async () => {
    const resp = await request(TheGraphUrls[chain.mainnet.id], proposalsQuery);
    return resp.proposals;
  }, []);

  const contracts = flatten(
    proposals.map((proposal) => [
      {
        ...governorContract,
        functionName: "proposals",
        args: [proposal.pid],
      },
      {
        ...governorContract,
        functionName: "state",
        args: [proposal.pid],
      },
    ])
  );

  const { data: proposalsMetadata } = useContractReads({
    enables: proposals?.length > 0,
    select: selectProposals,
    contracts,
    chainId: chain.mainnet.id,
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

  return (
    <GovernanceContext.Provider value={{ proposals }}>
      {children}
    </GovernanceContext.Provider>
  );
}
