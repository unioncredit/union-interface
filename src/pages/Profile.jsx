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
import PrimaryLabel from "components/shared/PrimaryLabel";
import { isAddress } from "ethers/lib/utils";
import { useParams } from "react-router-dom";
import { truncateAddress } from "utils/truncateAddress";
import {
  chain,
  useAccount,
  useEnsAddress,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { useMemberData } from "providers/MemberData";
import ProfileGovernanceStats from "components/profile/ProfileGovernanceStats";
import { EIP3770, ZERO_ADDRESS } from "constants";
import { compareAddresses } from "utils/compare";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useModals } from "providers/ModalManager";
import ConnectButton from "components/shared/ConnectButton";
import { blockExplorerAddress } from "utils/blockExplorer";
import useCopyToClipboard from "hooks/useCopyToClipboard";

function ProfileInner({ profileMember = {}, connectedMember = {}, chainId }) {
  const { open } = useModals();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const [copied, copy] = useCopyToClipboard();
  const [copiedAddress, copyAddress] = useCopyToClipboard();

  const {
    address = ZERO_ADDRESS,
    isMember = false,
    stakerAddresses = [],
    borrowerAddresses = [],
  } = profileMember;

  const { borrowerAddresses: connectedMemberBorrowerAddresses = [] } =
    connectedMember;

  const alreadyVouching = connectedMemberBorrowerAddresses.some((borrower) =>
    compareAddresses(borrower, address)
  );

  const isSelf = compareAddresses(
    profileMember.address,
    connectedMember.address
  );

  const handleVouch = async () => {
    await switchNetworkAsync(Number(chainId));
    open(VOUCH_MODAL, { address });
  };

  return (
    <Box fluid justify="center" direction="vertical">
      {/*--------------------------------------------------------------
        Profile Header 
      *--------------------------------------------------------------*/}
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
              <Badge
                mr="4px"
                color="grey"
                onClick={() => copyAddress(address)}
                label={copiedAddress ? "Copied!" : truncateAddress(address)}
              />
              <a
                href={blockExplorerAddress(chain.id, address)}
                target="_blank"
                rel="noreferrer"
              >
                <External width="24px" />
              </a>
            </Box>
            {/*--------------------------------------------------------------
              Vouch/Connect Button 
            *--------------------------------------------------------------*/}
            <ConnectButton
              buttonProps={{
                fluid: true,
                mt: "20px",
                label: (
                  <>
                    Connect to vouch for <PrimaryLabel address={address} />
                  </>
                ),
              }}
              connectedElement={
                <Button
                  fluid
                  mt="20px"
                  onClick={handleVouch}
                  disabled={alreadyVouching || isSelf}
                  label={
                    <>
                      {alreadyVouching ? "Already vouching for" : "Vouch for"}{" "}
                      <PrimaryLabel address={address} />
                    </>
                  }
                />
              }
            />
            <Button
              fluid
              mt="8px"
              icon={Link}
              variant="secondary"
              label={copied ? "Copied" : "Copy profile link"}
              onClick={() => copy(window.location.host + window.location.hash)}
            />
          </Box>
        </Card.Body>
      </Card>
      {/*--------------------------------------------------------------
        Profile details 
      *--------------------------------------------------------------*/}
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
  );
}

export default function Profile() {
  const { address: connectedAddress } = useAccount();
  const { addressOrEns: addressOrEnsParam } = useParams();

  // Profile pages support EIP3770 addresses so we need to check if
  // it starts with eth: or goe: or arb1: then parse out the address
  const addressOrEnsParts = addressOrEnsParam.split(":");
  const [tag, addressOrEns] = addressOrEnsParam.match(/^(eth|goe|arb1):/)
    ? addressOrEnsParts
    : [EIP3770[chain.mainnet.id], addressOrEnsParam];

  const { data: addressFromEns } = useEnsAddress({
    name: addressOrEns,
    chainId: chain.mainnet.id,
  });

  const address = isAddress(addressOrEns) ? addressOrEns : addressFromEns;

  const chainId = Object.keys(EIP3770).find((key) => EIP3770[key] === tag);

  const { data: profileMember } = useMemberData(address, chainId);

  const { data: connectedMember } = useMemberData(connectedAddress, chainId);

  return (
    <>
      <Helmet>
        <title>Profile {address} | Union Credit Protocol</title>
      </Helmet>
      <ProfileInner
        chainId={chainId}
        profileMember={profileMember}
        connectedMember={connectedMember}
      />
    </>
  );
}
