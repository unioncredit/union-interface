import { useEffect, useState } from "react";
import { fetchUserVotes } from "fetchers/fetchUserVotes";
import { fetchProposals } from "fetchers/fetchProposals";

export function useVoteParticipation(address) {
  const [voteCount, setVoteCount] = useState(0);
  const [proposalCount, setProposalCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    (async function () {
      const [userVotes, proposals] = await Promise.all([fetchUserVotes(address), fetchProposals()]);

      setVoteCount(userVotes.length);
      setProposalCount(proposals.length);
      setPercentage(
        ((parseFloat(userVotes.length) / parseFloat(proposals.length)) * 100).toFixed(2)
      );
    })();
  }, [address]);

  return { voteCount, proposalCount, percentage };
}
