import "./ProfileGovernanceStats.scss";

import { Box, Heading, LinkOutIcon, NumericalRows } from "@unioncredit/ui";

import { ZERO } from "constants";
import format from "utils/format";
import { useMemberData } from "providers/MemberData";
import { mainnet } from "wagmi/chains";
import { Versions } from "providers/Version";
import { useVoteParticipation } from "hooks/useVoteParticipation";

export default function ProfileGovernanceStats({ address }) {
  const { data: member = {} } = useMemberData(address, mainnet.id, Versions.V1);
  const { voteCount, proposalCount, percentage } = useVoteParticipation(address);

  const { unionBalance = ZERO, votes = ZERO } = member;

  const votesDelegated = votes.sub(unionBalance);

  return (
    <Box className="ProfileGovernanceStats" direction="vertical">
      <Box
        className="ProfileGovernanceStats__header"
        mb="16px"
        justify="space-between"
        align="center"
        fluid
      >
        <Heading m={0} level={2} size="small" weight="regular">
          Governance
        </Heading>

        <a
          href={`https://www.tally.xyz/profile/${address}?governanceId=eip155:1:0xe1b3F07a9032F0d3deDf3E96c395A4Da74130f6e`}
          target="_blank"
          rel="noreferrer"
        >
          View on Tally
          <LinkOutIcon />
        </a>
      </Box>

      <NumericalRows
        weight="regular"
        items={[
          {
            label: "Voting Power",
            value: `${format(votes)} Votes`,
          },
          {
            label: "Delegated Power",
            value: `${format(votesDelegated)} Votes`,
          },
          {
            label: "Vote Participation",
            value: `${voteCount}/${proposalCount} · ${percentage}%`,
          },
        ]}
      />
    </Box>
  );
}
