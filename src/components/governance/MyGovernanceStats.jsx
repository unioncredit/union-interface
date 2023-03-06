import {
  Box,
  Badge,
  Heading,
  Card,
  Button,
  Grid,
  Tooltip,
  Text,
  NumericalBlock,
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
import { useModals } from "providers/ModalManager";
import { DELEGATE_MODAL } from "components/modals/DelegateModal";

export default function MyGovernanceStats() {
  const { open } = useModals();
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
              <NumericalBlock title="Total Votes" value={format(votes, 0)} />
            </Grid.Col>
            <Grid.Col>
              <NumericalBlock
                title="Union Balance"
                value={format(unionBalance)}
              />
            </Grid.Col>
            <Grid.Col>
              <NumericalBlock
                title="From others"
                titleTooltip={{
                  content:
                    "If other users delegate their votes to you, they’ll appear here.",
                }}
                value={format(votesDelegated, 0)}
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col>
              <NumericalBlock
                mt="28px"
                title="DELEGATING TO"
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
                  onClick={() => open(DELEGATE_MODAL)}
                  label={
                    isVotingConfigured ? "Delegate votes" : "Set up voting"
                  }
                />
              </Box>
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Card.Body>
    </Card>
  );
}
