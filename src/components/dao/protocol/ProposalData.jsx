import { ProtocolDataHeader } from "components/dao/protocol/ProtocolDataHeader";
import { Box, Grid, NumericalBlock } from "@unioncredit/ui";
import { ZERO } from "constants";
import format from "utils/format";

export function ProposalData({ protocol, ...props }) {
  const { quorumVotes = ZERO, proposalThreshold = ZERO } = protocol;

  const data = [
    {
      title: "Quorum",
      value: format(quorumVotes, "UNION", 0),
      subtitle: "4% of supply",
    },
    {
      title: "Proposal Threshold",
      value: format(proposalThreshold, "UNION", 0),
      subtitle: "1% of supply",
    },
  ];

  return (
    <Box direction="vertical" {...props}>
      <ProtocolDataHeader title="Periods" subTitle="Time periods related to repayment of debts" />

      <Grid>
        <Grid.Row style={{ marginTop: "16px" }}>
          {data.map((item) => (
            <Grid.Col key={item.title}>
              <NumericalBlock size="small" align="left" token="union" {...item} />
            </Grid.Col>
          ))}
        </Grid.Row>
      </Grid>
    </Box>
  );
}
