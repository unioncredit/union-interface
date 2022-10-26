import {
  Badge,
  Bar,
  Button,
  ButtonRow,
  Card,
  Divider,
  Text,
  Box,
  Label,
  Stat,
} from "@unioncredit/ui";

import format from "utils/format";

export default function VotingCard() {
  const statusLabel = "Label";

  const forVotes = 0;
  const againstVotes = 0;
  const percentageFor = 0;
  const percentageAgainst = 0;

  return (
    <Card mb="24px">
      <Card.Header
        title="Voting"
        action={<Badge label={statusLabel} color="blue" />}
      />
      <Card.Body>
        <Box justify="space-between" mb="4px">
          <Label as="p" m={0}>
            For
          </Label>
          <Label as="p" m={0}>
            {format(forVotes)} Votes
          </Label>
        </Box>
        <Bar percentage={percentageFor} size="large" color="green" />
        <Box justify="space-between" mt="18px" mb="4px">
          <Label as="p" m={0}>
            Against
          </Label>
          <Label as="p" m={0}>
            {format(againstVotes)} Votes
          </Label>
        </Box>
        <Bar percentage={percentageAgainst} size="large" />
        <Box mt="22px">
          <Stat fluid label="Votes cast" value={0} />
          <Stat
            fluid
            label={
              <Label as="p" m={0} weight="medium" size="small">
                {0} Quorum {0 >= 1 && <WireCheck />}
              </Label>
            }
            value={<Bar size="large" percentage={0} />}
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
