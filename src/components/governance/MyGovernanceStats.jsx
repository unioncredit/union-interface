import {
  Box,
  Badge,
  Heading,
  Card,
  Button,
  Stat,
  Grid,
  Tooltip,
  Label,
} from "@unioncredit/ui";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { ReactComponent as TooltipIcon } from "@unioncredit/ui/lib/icons/tooltip.svg";
import { ReactComponent as External } from "@unioncredit/ui/lib/icons/externalinline.svg";

import Avatar from "components/shared/Avatar";
import PrimaryLabel from "components/shared/PrimaryLabel";
import { truncateAddress } from "utils/truncateAddress";
import format from "utils/format";
import { useMember } from "providers/MemberData";
import { ZERO } from "constants";
import { ZERO_ADDRESS } from "constants";

export default function MyGovernanceStats() {
  const { address } = useAccount();
  const { data: member = {} } = useMember();

  const { unionBalance = ZERO, votes = ZERO, delegate = ZERO_ADDRESS } = member;

  const votesDelegated = votes.sub(unionBalance);

  const isVotingConfigured = delegate !== ZERO_ADDRESS;
  const isDelegatingToSelf = delegate === address;

  return (
    <Card>
      <Card.Body>
        <Grid>
          <Grid.Row>
            <Grid.Col xs={12}>
              <Box align="center" mb="24px">
                <Avatar size={54} address={address} />
                <Box direction="vertical" mx="16px">
                  <Heading level={2} mb="4px">
                    <PrimaryLabel address={address} />
                  </Heading>
                  <Badge color="grey" label={truncateAddress(address)} />
                </Box>
              </Box>
            </Grid.Col>
          </Grid.Row>
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
          <Grid.Row>
            <Grid.Col>
              <Stat
                mt="28px"
                label="DELEGATING TO"
                value={
                  !isVotingConfigured ? (
                    "Not configured"
                  ) : isDelegatingToSelf ? (
                    "Self"
                  ) : (
                    <Link to={`/profile/${delegate}`}>
                      <PrimaryLabel address={delegate} />
                      <External width="24px" height="24px" />
                    </Link>
                  )
                }
              />
            </Grid.Col>
            <Grid.Col>
              <Box ml="auto">
                <Button
                  mt="28px"
                  variant="secondary"
                  label={
                    isVotingConfigured ? "Delegate votes" : "Set up voting"
                  }
                  onClick={() => alert()}
                />
              </Box>
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Card.Body>
    </Card>
  );
}
