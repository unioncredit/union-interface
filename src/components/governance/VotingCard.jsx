import {
  Badge,
  Button,
  ButtonRow,
  Card,
  Divider,
  Text,
  Box,
  NumericalBlock,
  WireCheckIcon,
  PercentBar,
} from "@unioncredit/ui";
import { StatusColorMap } from "constants";
import { ZERO } from "constants";
import { useProtocol } from "providers/ProtocolData";

import format from "utils/format";
import { bnPercent, percent } from "utils/numbers";

export default function VotingCard({ data }) {
  const { data: protocol } = useProtocol();

  const {
    status,
    forVotes = ZERO,
    againstVotes = ZERO,
    totalSupply = ZERO,
    quorumVotes = ZERO,
  } = { ...data, ...protocol };

  const totalVotes = forVotes.add(againstVotes);

  const percentageFor = bnPercent(forVotes, totalVotes);
  const percentageAgainst = bnPercent(againstVotes, totalVotes);
  const quorumPercent = bnPercent(quorumVotes, totalSupply);
  const quorumProgress = bnPercent(totalVotes, quorumVotes);

  return (
    <Card mb="24px">
      <Card.Header
        title="Voting"
        action={<Badge label={status} color={StatusColorMap[status]} />}
      />
      <Card.Body>
        <Box justify="space-between" mb="4px">
          <Text m={0}>For</Text>
          <Text m={0}>{format(forVotes, 0)} Votes</Text>
        </Box>
        <PercentBar percentage={percentageFor * 100} />
        <Box justify="space-between" mt="18px" mb="4px">
          <Text m={0}>Against</Text>
          <Text m={0}>{format(againstVotes, 0)} Votes</Text>
        </Box>
        <PercentBar percentage={percentageAgainst * 100} />
        <Box mt="22px">
          <Stat fluid label="Votes cast" value={format(totalVotes, 0)} />
          <NumericalBlock
            title={`${percent(quorumPercent)} Quorum ${
              0 >= 1 && <WireCheckIcon />
            }`}
            barProps={{
              percentage: quorumProgress * 100,
            }}
          />
        </Box>
        {false && (
          <>
            <Divider my="24px" />
            {votedFor ? (
              <Text m={0} color="green500" align="center">
                You voted for
              </Text>
            ) : votedAgainst ? (
              <Text m={0} color="red500" align="center">
                You voted against
              </Text>
            ) : !canVote ? (
              <Text m={0} align="center">
                You did not vote
              </Text>
            ) : (
              <ButtonRow mt="16px">
                <Button
                  fluid
                  label="Vote for"
                  rounded
                  color="green"
                  disabled={false}
                  onClick={() => alert()}
                />
                <Button
                  fluid
                  label="Vote against"
                  rounded
                  color="red"
                  disabled={false}
                  onClick={() => alert()}
                />
              </ButtonRow>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}
