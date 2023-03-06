import { Grid, Tooltip, Text, NumericalBlock } from "@unioncredit/ui";
import { ReactComponent as TooltipIcon } from "@unioncredit/ui/lib/icons/tooltip.svg";

import { ZERO } from "constants";
import format from "utils/format";
import { useMember } from "providers/MemberData";

export default function ProfileGovernanceStats() {
  const { data: member = {} } = useMember();

  const { unionBalance = ZERO, votes = ZERO } = member;

  const votesDelegated = votes.sub(unionBalance);

  return (
    <Grid>
      <Grid.Row>
        <Grid.Col>
          <NumericalBlock
            size="x-small"
            title="Total Votes"
            value={format(votes, 0)}
          />
        </Grid.Col>
        <Grid.Col>
          <NumericalBlock
            size="x-small"
            title="Union Balance"
            value={format(unionBalance, 0)}
          />
        </Grid.Col>
        <Grid.Col>
          <NumericalBlock
            size="x-small"
            title="From others"
            titleTooltip={{
              position: "left",
              content:
                "If other users delegate their votes to you, they’ll appear here.",
            }}
            value={format(votesDelegated, 0)}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}
