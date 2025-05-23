import "./RewardStats.scss";

import { Box, Button, Card, ClaimIcon, NumericalBlock } from "@unioncredit/ui";
import { TOKENS, ZERO } from "constants";
import format from "utils/format";
import useWrite from "hooks/useWrite";
import useRewards from "hooks/useRewards";
import { useToken } from "hooks/useToken";

export default function RewardStats() {
  const { token } = useToken();
  const {
    unclaimed = ZERO,
    estimatedDailyBase = ZERO,
    estimatedDailyTotal = ZERO,
    estimatedDailyBonus = ZERO,
    estimatedDailyPenalty = ZERO,
  } = useRewards();

  const buttonProps = useWrite({
    contract: "userManager",
    method: "withdrawRewards",
    enabled: unclaimed > 0n,
  });

  return (
    <Card mt="24px" className="RewardStats">
      <Card.Body>
        <Box className="RewardStats__top" align="center" justify="space-between">
          <NumericalBlock
            align="left"
            token="union"
            title="Unclaimed Rewards"
            value={format(unclaimed, TOKENS.UNION, 4)}
          />
          <Button
            size="large"
            variant="light"
            color="secondary"
            icon={ClaimIcon}
            label="Claim Rewards"
            {...buttonProps}
          />
        </Box>

        <Box mt="24px" align="center" justify="space-between" className="RewardStats__bottom">
          <NumericalBlock
            fluid
            size="medium"
            align="left"
            token="union"
            title="Base Reward"
            value={format(estimatedDailyBase, TOKENS.UNION)}
            titleTooltip={{
              content: `UNION you get just for depositing ${token}`,
            }}
          />
          <NumericalBlock
            fluid
            size="medium"
            align="left"
            token="union"
            title="Bonus"
            className="RewardStats__bonus"
            value={`+${format(estimatedDailyBonus, TOKENS.UNION)}`}
            titleTooltip={{
              content: "UNION you get because you vouched for someone actively borrowing",
            }}
          />
          <NumericalBlock
            fluid
            size="medium"
            align="left"
            token="union"
            title="Penalty"
            className="RewardStats__penalty"
            value={`-${format(estimatedDailyPenalty, TOKENS.UNION)}`}
            titleTooltip={{
              content:
                "Not a strict penalty, you just dont earn any UNION for stake backing a borrower in default",
            }}
          />
          <NumericalBlock
            fluid
            size="medium"
            align="left"
            token="union"
            title="Est. Daily"
            value={format(estimatedDailyTotal, TOKENS.UNION)}
            titleTooltip={{
              content: "The very rough estimate of how many UNION you'll earn in a day",
            }}
          />
        </Box>
      </Card.Body>
    </Card>
  );
}
