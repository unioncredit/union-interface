import { Badge, Card, Text, Box, NumericalBlock, PercentBar } from "@unioncredit/ui";
import { StatusColorMap } from "constants";
import { ZERO } from "constants";
import { useProtocol } from "providers/ProtocolData";

import format from "utils/format";
import { bnPercent } from "utils/numbers";

export default function ProposalVotes({ data }) {
  const { data: protocol } = useProtocol();

  const { status, forVotes = ZERO, againstVotes = ZERO } = { ...data, ...protocol };

  const totalVotes = forVotes.add(againstVotes);

  const percentageFor = bnPercent(forVotes, totalVotes);
  const percentageAgainst = bnPercent(againstVotes, totalVotes);

  return (
    <Card mb="24px">
      <Card.Header
        title="Voting"
        action={<Badge className="capitalizeFirst" label={status} color={StatusColorMap[status]} />}
      />
      <Card.Body>
        <Box justify="space-between" mb="4px">
          <Text m={0}>For</Text>
          <Text m={0}>{format(forVotes, "UNION", 0)} Votes</Text>
        </Box>
        <PercentBar percentage={percentageFor * 100} />
        <Box justify="space-between" mt="18px" mb="4px">
          <Text m={0}>Against</Text>
          <Text m={0}>{format(againstVotes, "UNION", 0)} Votes</Text>
        </Box>
        <PercentBar percentage={percentageAgainst * 100} />
        <Box mt="22px">
          <NumericalBlock
            fluid
            align="left"
            size="x-small"
            title="Votes cast"
            value={format(totalVotes, "UNION", 0)}
          />
        </Box>
      </Card.Body>
    </Card>
  );
}
