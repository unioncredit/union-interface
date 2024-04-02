import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Box, NumericalRows } from "@unioncredit/ui";
import { BlockSpeed, ZERO } from "constants";
import { commify } from "utils/format";
import { mainnet } from "wagmi/chains";

export function ProposalStages({ protocol, ...props }) {
  const {
    getMinDelay = ZERO,
    votingDelay = ZERO,
    votingPeriod = ZERO,
  } = protocol;

  const votingDelayHours = votingDelay
    .mul(BlockSpeed[mainnet.id])
    .div(3600000)
    .toNumber();

  const votingPeriodHours = votingPeriod
    .mul(BlockSpeed[mainnet.id])
    .div(3600000)
    .toNumber();

  const timelockHours = getMinDelay
    .mul(BlockSpeed[mainnet.id])
    .div(3600000)
    .toNumber();

  return (
    <Box direction="vertical" {...props}>
      <ProtocolDataHeader
        title="Stages"
        subTitle="Stages in the governance and voting process"
      />

      <NumericalRows
        mt="24px"
        items={[
          {
            label: "Delay Period",
            value: `~${votingDelayHours}h · ${commify(votingDelay, 0)} blocks`,
            tooltip: {
              shrink: true,
              content: "The review period between when a proposal has been proposed and when you can vote",
              position: "right",
            },
          },
          {
            label: "Voting Period",
            value: `~${votingPeriodHours}h · ${commify(
              votingPeriod,
              0
            )} blocks`,
            tooltip: {
              shrink: true,
              content: "The period in which UNION dao members cast their votes. If you transfer your tokens in this period they wont count as votes",
              position: "right",
            },
          },
          {
            label: "Timelock",
            value: `~${timelockHours}h · ${commify(getMinDelay, 0)} blocks`,
            tooltip: {
              shrink: true,
              content: "The period between when a proposal is passed and when it is executed",
              position: "right",
            },
          },
        ]}
      />
    </Box>
  );
}
