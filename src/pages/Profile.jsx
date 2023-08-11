import "./Profile.scss";

import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Heading,
  Text,
  Avatar as UiAvatar,
  BadgeRow,
  NumericalBlock,
  LinkOutIcon,
  VouchIcon,
  SwitchIcon,
  Layout,
  ManageIcon,
  CancelIcon,
  BadgeIndicator,
} from "@unioncredit/ui";
import { useAccount, useEnsAddress, useNetwork, useSwitchNetwork } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Helmet } from "react-helmet";
import { isAddress } from "ethers/lib/utils";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { Avatar, ConnectButton, PrimaryLabel } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import { useMemberData } from "providers/MemberData";
import { EIP3770, ZERO, ZERO_ADDRESS } from "constants";
import { compareAddresses } from "utils/compare";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useModals } from "providers/ModalManager";
import { blockExplorerAddress } from "utils/blockExplorer";
import useNetworks from "hooks/useNetworks";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import ProfileGovernanceStats from "components/profile/ProfileGovernanceStats";
import { getVersion, useVersion } from "providers/Version";
import { useProtocol } from "../providers/ProtocolData";
import { BigNumber } from "ethers";
import { useVersionBlockNumber } from "../hooks/useVersionBlockNumber";
import { PUBLIC_WRITE_OFF_DEBT_MODAL } from "../components/modals/PublicWriteOffDebtModal";

function ProfileInner({ profileMember = {}, connectedMember = {}, chainId }) {
  const navigate = useNavigate();

  const { open } = useModals();
  const { isV2 } = useVersion();
  const { data: protocol } = useProtocol();
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId,
  });

  const [copied, copy] = useCopyToClipboard();
  const [copiedAddress, copyAddress] = useCopyToClipboard();

  const networks = useNetworks(true);

  const {
    isMember = false,
    isOverdue = false,
    stakerAddresses = [],
    borrowerAddresses = [],
    lastRepay = ZERO,
  } = profileMember;

  const { overdueTime = ZERO, overdueBlocks = ZERO, maxOverdueTime = ZERO } = protocol;

  const maxOverdueTotal = (overdueTime || overdueBlocks).add(maxOverdueTime);
  const isMaxOverdue =
    isOverdue &&
    lastRepay &&
    isV2 &&
    BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

  const address = profileMember.address || ZERO_ADDRESS;

  const { borrowerAddresses: connectedMemberBorrowerAddresses = [] } = connectedMember;

  const alreadyVouching = connectedMemberBorrowerAddresses.some((borrower) =>
    compareAddresses(borrower, address)
  );

  const isSelf = compareAddresses(
    profileMember.address || ZERO_ADDRESS,
    connectedMember.address || ZERO_ADDRESS
  );

  const targetNetwork = networks.find((network) => network.chainId === Number(chainId));

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
            <Box mt="8px" align="center">
              <BadgeRow>
                <Badge
                  mr="4px"
                  color="grey"
                  onClick={() => copyAddress(address)}
                  label={copiedAddress ? "Copied!" : truncateAddress(address)}
                />
                {isMaxOverdue ? (
                  <BadgeIndicator label="Write-Off" color="red500" textColor="red500" />
                ) : isMember ? (
                  <BadgeIndicator label="Member" color="blue500" />
                ) : (
                  <BadgeIndicator label="Non-member" />
                )}
              </BadgeRow>
              <a href={blockExplorerAddress(chainId, address)} target="_blank" rel="noreferrer">
                <LinkOutIcon width="24px" />
              </a>
            </Box>
            {/*--------------------------------------------------------------
              Vouch/Connect Button 
            *--------------------------------------------------------------*/}
            <ConnectButton
              buttonProps={{
                fluid: true,
                label: "Connect Wallet",
                style: {
                  marginTop: "20px",
                },
              }}
              connectedElement={
                isSelf ? (
                  <Button fluid to="/" mt="20px" as={RouterLink} label="Go to Dashboard" />
                ) : connectedChain?.id !== Number(chainId) ? (
                  <Button
                    fluid
                    mt="20px"
                    color="blue"
                    icon={SwitchIcon}
                    label={`Switch to ${targetNetwork?.label}`}
                    onClick={() => switchNetworkAsync(targetNetwork?.chainId)}
                  />
                ) : isMaxOverdue ? (
                  <Button
                    fluid
                    mt="20px"
                    icon={CancelIcon}
                    label="Write-off debt"
                    className="WriteOffButton"
                    onClick={() =>
                      open(PUBLIC_WRITE_OFF_DEBT_MODAL, {
                        address: profileMember.address,
                      })
                    }
                  />
                ) : alreadyVouching ? (
                  <Button
                    fluid
                    mt="20px"
                    icon={ManageIcon}
                    label="Manage Contact"
                    onClick={() => navigate(`/contacts/providing?address=${address}`)}
                  />
                ) : !connectedMember.isMember ? (
                  <Button fluid to="/" mt="20px" as={RouterLink} label="Register to vouch" />
                ) : (
                  <Button
                    fluid
                    mt="20px"
                    icon={VouchIcon}
                    onClick={() => {
                      open(VOUCH_MODAL, { address });
                    }}
                    label={targetNetwork ? `Vouch on ${targetNetwork.label}` : "Vouch"}
                  />
                )
              }
            />
            <Button
              fluid
              mt="8px"
              icon={RouterLink}
              color="secondary"
              variant="light"
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
      <Layout.Columned mt="24px" maxw="653px">
        <ProfileInner
          chainId={chainId}
          profileMember={profileMember}
          connectedMember={connectedMember}
        />
      </Layout.Columned>
    </>
  );
}
