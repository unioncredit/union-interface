import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Heading,
  Stat,
  Text,
} from "@unioncredit/ui";
import { Helmet } from "react-helmet";
import { ReactComponent as Link } from "@unioncredit/ui/lib/icons/link.svg";
import { ReactComponent as External } from "@unioncredit/ui/lib/icons/external.svg";

import Avatar from "components/shared/Avatar";
import Header from "components/shared/Header";
import PrimaryLabel from "components/shared/PrimaryLabel";
import { isAddress } from "ethers/lib/utils";
import { useParams } from "react-router-dom";
import { truncateAddress } from "utils/truncateAddress";
import { useEnsAddress } from "wagmi";
import MemberData, { useMember } from "providers/MemberData";
import ProfileGovernanceStats from "components/profile/ProfileGovernanceStats";

function ProfileInner({ address }) {
  const { data: member = {} } = useMember();

  const {
    isMember = false,
    stakerAddresses = [],
    borrowerAddresses = [],
  } = member;

  return (
    <>
      <Helmet>
        <title>Profile {address} | Union Credit Protocol</title>
      </Helmet>
      <Header />
      <Box fluid justify="center" direction="vertical" mb="120px">
        <Card mb="24px">
          <Card.Body>
            <Box direction="vertical" align="center">
              <Avatar address={address} size={56} />
              <Heading mt="8px" mb={0}>
                <PrimaryLabel address={address} />
              </Heading>
              <Box mt="8px">
                {isMember ? (
                  <Badge label="Union Member" color="blue" mr="4px" />
                ) : (
                  <Badge label="Not a member" color="grey" mr="4px" />
                )}
              </Box>
              <Box mt="8px">
                <Badge label={truncateAddress(address)} color="grey" mr="4px" />
                <a href="#" target="_blank" rel="noreferrer">
                  <External width="24px" />
                </a>
              </Box>
              <Button
                fluid
                mt="20px"
                icon={Link}
                variant="secondary"
                label="Copy profile link"
              />
            </Box>
          </Card.Body>
        </Card>
        <Card mb="24px">
          <Card.Body>
            <Heading mb="24px">Reputation</Heading>
            <Text mb="12px">Wallet traits</Text>
            <Grid>
              <Grid.Row>
                <Grid.Col>
                  <Stat
                    label="receiving vouches from"
                    value={`${stakerAddresses.length} accounts`}
                  />
                </Grid.Col>
                <Grid.Col>
                  <Stat
                    label="Vouching for"
                    value={`${borrowerAddresses.length} accounts`}
                  />
                </Grid.Col>
              </Grid.Row>
            </Grid>
            <Divider my="24px" />
            <Heading mb="24px">Governance</Heading>
            <ProfileGovernanceStats />
          </Card.Body>
        </Card>
      </Box>
    </>
  );
}

export default function Profile() {
  const { addressOrEns } = useParams();
  const { data: addressFromEns } = useEnsAddress({
    name: addressOrEns,
  });

  const address = isAddress(addressOrEns) ? addressOrEns : addressFromEns;

  return (
    <MemberData address={address}>
      <ProfileInner address={address} />
    </MemberData>
  );
}
