import { Stat, Grid, Tooltip, Label } from "@unioncredit/ui";
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
          <Stat label="Total Votes" value={format(votes, 0)} />
        </Grid.Col>
        <Grid.Col>
          <Stat label="Union Balance" value={format(unionBalance)} />
        </Grid.Col>
        <Grid.Col>
          <Stat
            label={
              <Label size="small" weight="medium">
                From others{" "}
                <Tooltip content="If other users delegate their votes to you, they’ll appear here.">
                  <TooltipIcon />
                </Tooltip>
              </Label>
            }
            value={format(votesDelegated, 0)}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}
