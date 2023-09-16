import "./Profile.scss";

import { Box, Card, Divider, Grid, Heading, Text, NumericalBlock, Layout } from "@unioncredit/ui";
import { useAccount, useEnsAddress, useNetwork } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Helmet } from "react-helmet";
import { isAddress } from "ethers/lib/utils";
import { useParams } from "react-router-dom";
import { useMemberData } from "providers/MemberData";
import { EIP3770, ZERO_ADDRESS } from "constants";
import ProfileGovernanceStats from "components/profile/ProfileGovernanceStats";
import { getVersion } from "providers/Version";
import ProfileHeader from "../components/profile/ProfileHeader";

function ProfileInner({ profileMember = {}, chainId }) {
  const { chain: connectedChain } = useNetwork();

  const { stakerAddresses = [], borrowerAddresses = [] } = profileMember;

  const address = profileMember.address || ZERO_ADDRESS;

  return (
    <Box fluid justify="center" direction="vertical" className="ProfileInner">
      {/*--------------------------------------------------------------
        Profile Header 
      *--------------------------------------------------------------*/}
      <Card mb="24px">
        <Card.Body p={0}>
          <ProfileHeader address={address} profileMember={profileMember} chainId={chainId} />
        </Card.Body>
      </Card>
      {/*--------------------------------------------------------------
        Profile details 
      *--------------------------------------------------------------*/}
      <Card mb="24px">
        <Card.Body>
          <Heading mb="24px">Reputation</Heading>
          <Text color="grey500" mb="12px">
            Wallet traits
          </Text>
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <NumericalBlock
                  align="left"
                  size="small"
                  title="Receiving vouches from"
                  value={`${stakerAddresses?.length ?? 0} accounts`}
                />
              </Grid.Col>
              <Grid.Col>
                <NumericalBlock
                  align="left"
                  size="small"
                  title="Vouching for"
                  value={`${borrowerAddresses?.length ?? 0} accounts`}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
          <Divider my="24px" />
          <Heading mb="24px">Governance</Heading>
          <ProfileGovernanceStats address={address} chainId={connectedChain?.id} />
        </Card.Body>
      </Card>
    </Box>
  );
}

export default function Profile() {
  const { address: connectedAddress } = useAccount();
  const { addressOrEns: addressOrEnsParam } = useParams();

  // Profile pages support EIP3770 addresses so we need to check if
  // it starts with eth: or goe: or arb1: then parse out the address
  const addressOrEnsParts = addressOrEnsParam.split(":");
  const [tag, addressOrEns] = addressOrEnsParam.match(/^(eth|goe|arb1|optgoe|opt):/)
    ? addressOrEnsParts
    : [EIP3770[mainnet.id], addressOrEnsParam];

  const { data: addressFromEns } = useEnsAddress({
    name: addressOrEns,
    chainId: mainnet.id,
  });

  const address = isAddress(addressOrEns) ? addressOrEns : addressFromEns;

  const chainId = Object.keys(EIP3770).find((key) => EIP3770[key] === tag);

  const { data: profileMember } = useMemberData(address, chainId, getVersion(chainId));

  const { data: connectedMember } = useMemberData(connectedAddress, chainId);

  return (
    <>
      <Helmet>
        <title>{`Profile ${address} | Union Credit Protocol`}</title>
      </Helmet>
      <Layout.Columned mt="24px" maxw="985px">
        <ProfileInner
          chainId={chainId}
          profileMember={profileMember}
          connectedMember={connectedMember}
        />
      </Layout.Columned>
    </>
  );
}
