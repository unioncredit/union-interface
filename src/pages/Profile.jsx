import "./Profile.scss";

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
  Avatar as UiAvatar,
  BadgeRow,
} from "@unioncredit/ui";
import { useAccount, useEnsAddress, useNetwork, useSwitchNetwork } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Helmet } from "react-helmet";
import { isAddress } from "ethers/lib/utils";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Link } from "@unioncredit/ui/lib/icons/link.svg";
import { ReactComponent as External } from "@unioncredit/ui/lib/icons/external.svg";
import { ReactComponent as Manage } from "@unioncredit/ui/lib/icons/manage.svg";
import { ReactComponent as Vouch } from "@unioncredit/ui/lib/icons/vouch.svg";
import { ReactComponent as Switch } from "@unioncredit/ui/lib/icons/switch.svg";

import Avatar from "components/shared/Avatar";
import PrimaryLabel from "components/shared/PrimaryLabel";
import { truncateAddress } from "utils/truncateAddress";
import { useMemberData } from "providers/MemberData";
import { EIP3770, ZERO_ADDRESS } from "constants";
import { compareAddresses } from "utils/compare";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useModals } from "providers/ModalManager";
import ConnectButton from "components/shared/ConnectButton";
import { blockExplorerAddress } from "utils/blockExplorer";
import useNetworks from "hooks/useNetworks";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import ProfileGovernanceStats from "components/profile/ProfileGovernanceStats";

function ProfileInner({ profileMember = {}, connectedMember = {}, chainId }) {
  const navigate = useNavigate();

  const { open } = useModals();
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const [copied, copy] = useCopyToClipboard();
  const [copiedAddress, copyAddress] = useCopyToClipboard();

  const networks = useNetworks(true);

  const {
    isMember = false,
    stakerAddresses = [],
    borrowerAddresses = [],
  } = profileMember;

  const address = profileMember.address || ZERO_ADDRESS;

  const { borrowerAddresses: connectedMemberBorrowerAddresses = [] } =
    connectedMember;

  const alreadyVouching = connectedMemberBorrowerAddresses.some((borrower) =>
    compareAddresses(borrower, address)
  );

  const isSelf = compareAddresses(
    profileMember.address || ZERO_ADDRESS,
    connectedMember.address || ZERO_ADDRESS
  );

  const targetNetwork = networks.find(
    (network) => network.chainId === Number(chainId)
  );

  return (
    <Box fluid justify="center" direction="vertical" className="ProfileInner">
      {/*--------------------------------------------------------------
        Profile Header 
      *--------------------------------------------------------------*/}
      <Card mb="24px">
        <Card.Body>
          <Box direction="vertical" align="center">
            <div className="ProfileInner__avatar">
              <Avatar address={address} size={56} />
              <div className="ProfileInner__avatar__network">
                <UiAvatar src={targetNetwork?.imageSrc} size={24} />
              </div>
            </div>
            <Heading mt="8px" mb={0}>
              <PrimaryLabel address={address} />
            </Heading>
            <Box mt="8px">
              <BadgeRow>
                <Badge
                  mr="4px"
                  color="grey"
                  onClick={() => copyAddress(address)}
                  label={copiedAddress ? "Copied!" : truncateAddress(address)}
                />
                {isMember ? (
                  <Badge label="Union Member" color="blue" mr="4px" />
                ) : (
                  <Badge label="Not a member" color="grey" mr="4px" />
                )}
              </BadgeRow>
              <a
                href={blockExplorerAddress(chainId, address)}
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
                label: "Connect Wallet",
              }}
              connectedElement={
                isSelf ? (
                  <Button
                    fluid
                    to="/"
                    mt="20px"
                    as={RouterLink}
                    label="Go to Dashboard"
                  />
                ) : connectedChain?.id !== Number(chainId) ? (
                  <Button
                    fluid
                    mt="20px"
                    color="blue"
                    icon={Switch}
                    label={`Switch to ${targetNetwork?.label}`}
                    onClick={() => switchNetworkAsync(targetNetwork?.chainId)}
                  />
                ) : alreadyVouching ? (
                  <Button
                    fluid
                    mt="20px"
                    icon={Manage}
                    label="Manage Contact"
                    onClick={() => navigate(`/contacts/?address=${address}`)}
                  />
                ) : !connectedMember.isMember ? (
                  <Button
                    fluid
                    to="/"
                    mt="20px"
                    as={RouterLink}
                    label="Register to vouch"
                  />
                ) : (
                  <Button
                    fluid
                    mt="20px"
                    icon={Vouch}
                    onClick={() => {
                      open(VOUCH_MODAL, { address });
                    }}
                    label={
                      targetNetwork
                        ? `Vouch on ${targetNetwork.label}`
                        : "Vouch"
                    }
                  />
                )
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
          <ProfileGovernanceStats
            address={address}
            chainId={connectedChain?.id}
          />
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
  const [tag, addressOrEns] = addressOrEnsParam.match(/^(eth|goe|arb1|optgoe):/)
    ? addressOrEnsParts
    : [EIP3770[mainnet.id], addressOrEnsParam];

  const { data: addressFromEns } = useEnsAddress({
    name: addressOrEns,
    chainId: mainnet.id,
  });

  const address = isAddress(addressOrEns) ? addressOrEns : addressFromEns;

  const chainId = Object.keys(EIP3770).find((key) => EIP3770[key] === tag);

  const { data: profileMember } = useMemberData(address, chainId);

  const { data: connectedMember } = useMemberData(connectedAddress, chainId);

  return (
    <>
      <Helmet>
        <title>{`Profile ${address} | Union Credit Protocol`}</title>
      </Helmet>
      <ProfileInner
        chainId={chainId}
        profileMember={profileMember}
        connectedMember={connectedMember}
      />
    </>
  );
}
