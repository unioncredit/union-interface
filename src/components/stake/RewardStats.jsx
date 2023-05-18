import "./RewardStats.scss";

import { Box, Button, Card, ClaimIcon, NumericalBlock } from "@unioncredit/ui";
import { ZERO } from "constants";
import format from "utils/format";
import useWrite from "hooks/useWrite";
import useRewards from "hooks/useRewards";

export default function RewardStats() {
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
    enabled: unclaimed.gt(0),
  });

  return (
    <Card mt="24px" className="RewardStats">
      <Card.Body>
        <Box
          className="RewardStats__top"
          align="center"
          justify="space-between"
        >
          <NumericalBlock
            align="left"
            token="union"
            title="Unclaimed Rewards"
            value={format(unclaimed, 4)}
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

        <Box
          mt="24px"
          align="center"
          justify="space-between"
          className="RewardStats__bottom"
        >
          <NumericalBlock
            fluid
            size="medium"
            align="left"
            token="union"
            title="Base Reward"
            value={format(estimatedDailyBase)}
            titleTooltip={{
              shrink: true,
              content: "TODO",
            }}
          />
          <NumericalBlock
            fluid
            size="medium"
            align="left"
            token="union"
            title="Bonus"
            className="RewardStats__bonus"
            value={`+${format(estimatedDailyBonus)}`}
            titleTooltip={{
              shrink: true,
              content: "TODO",
            }}
          />
          <NumericalBlock
            fluid
            size="medium"
            align="left"
            token="union"
            title="Penalty"
            className="RewardStats__penalty"
            value={`-${format(estimatedDailyPenalty)}`}
            titleTooltip={{
              shrink: true,
              content: "TODO",
            }}
          />
          <NumericalBlock
            fluid
            size="medium"
            align="left"
            token="union"
            title="Est. Daily"
            value={format(estimatedDailyTotal)}
            titleTooltip={{
              shrink: true,
              content: "TODO",
            }}
          />
        </Box>
      </Card.Body>
    </Card>
  );
}
