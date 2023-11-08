import "./ProfileHeader.scss";

import cn from "classnames";
import {
  Text,
  Box,
  Heading,
  LinkOutIcon,
  ProfileIcon,
  Select,
  Button,
  ManageIcon,
  CopyIcon,
  SwitchIcon,
  CancelIcon,
  VouchIcon,
  BadgeRow,
  Badge,
  BadgeIndicator,
} from "@unioncredit/ui";

import { compareAddresses } from "utils/compare";

import { Avatar, ConnectButton, PrimaryLabel } from "../shared";
import { blockExplorerAddress } from "utils/blockExplorer";
import { EIP3770, ZERO, ZERO_ADDRESS } from "constants";
import { getVersion, useVersion, Versions } from "providers/Version";
import { useEffect, useMemo, useState } from "react";
import { ReactComponent as FarcasterIcon } from "images/verification/farcaster.svg";
import { ReactComponent as TwitterIcon } from "images/verification/twitter.svg";
import { ReactComponent as LensIcon } from "images/verification/lens.svg";
import useResponsive from "hooks/useResponsive";
import { truncateAddress } from "../../utils/truncateAddress";
import { networks } from "config/networks";
import { Link, useNavigate } from "react-router-dom";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { getProfileUrl } from "../../utils/generateLinks";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useMember, useMemberData } from "../../providers/MemberData";
import { BigNumber } from "ethers";
import { PUBLIC_WRITE_OFF_DEBT_MODAL } from "../modals/PublicWriteOffDebtModal";
import { useVersionBlockNumber } from "../../hooks/useVersionBlockNumber";
import { useProtocol } from "../../providers/ProtocolData";
import { VOUCH_MODAL } from "../modals/VouchModal";
import { useModals } from "../../providers/ModalManager";

const ProfileAddress = ({ member, chainId }) => {
  const { isV2 } = useVersion();
  const { data: protocol } = useProtocol();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId,
  });

  const { isMember = false, isOverdue = false, lastRepay = ZERO } = member;
  const { overdueTime = ZERO, overdueBlocks = ZERO, maxOverdueTime = ZERO } = protocol;

  const maxOverdueTotal = (overdueTime || overdueBlocks).add(maxOverdueTime);

  const isMaxOverdue =
    isOverdue &&
    lastRepay &&
    isV2 &&
    BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

  return isMaxOverdue ? (
    <BadgeIndicator label="Write-Off" color="red500" textColor="red500" />
  ) : isMember ? (
    <BadgeIndicator label="Member" color="blue500" />
  ) : (
    <BadgeIndicator label="Non-member" />
  );
};

export default function ProfileHeader({ address, chainId }) {
  const navigate = useNavigate();
  const { open } = useModals();
  const { isConnected } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { data: connectedMember } = useMember();
  const { data: member } = useMemberData(address, chainId, getVersion(chainId));
  const { data: protocol } = useProtocol();
  const { isMobile, isTablet } = useResponsive();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId,
  });

  const [data, setData] = useState(null);
  const [copiedAddress, copy] = useCopyToClipboard();

  const { isOverdue = false, lastRepay = ZERO } = member;

  const { overdueTime = ZERO, overdueBlocks = ZERO, maxOverdueTime = ZERO } = protocol;
  const { borrowerAddresses: connectedMemberBorrowerAddresses = [] } = connectedMember;

  const maxOverdueTotal = (overdueTime || overdueBlocks).add(maxOverdueTime);
  const isMaxOverdue =
    blockNumber &&
    isOverdue &&
    lastRepay &&
    getVersion(chainId) === Versions.V2 &&
    BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

  const alreadyVouching = connectedMemberBorrowerAddresses.some((borrower) =>
    compareAddresses(borrower, address)
  );

  const network = useMemo(() => {
    return (
      [...networks[Versions.V1], ...networks[Versions.V2]].find(
        (network) => network.chainId === parseInt(chainId)
      ) || networks[Versions.V1][0]
    );
  }, [networks, chainId]);

  useEffect(() => {
    if (address !== ZERO_ADDRESS) {
      fetch(`https://identity.union.finance/address/${address}`)
        .then((res) => res.json())
        .then(setData)
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [address]);

  return (
    <Box
      fluid
      justify="space-between"
      align="flex-start"
      direction={isMobile ? "vertical" : "horizontal"}
      className="ProfileHeader"
    >
      <Box className="ProfileHeader__card" fluid>
        <Box className="ProfileHeader__avatar" align="flex-start" justify="space-between">
          <Avatar address={address} size={112} />

          {isMobile && (
            <Box>
              <Select
                options={[...networks[Versions.V1], ...networks[Versions.V2]].map((n) => ({
                  ...n,
                  label: null,
                }))}
                defaultValue={{ ...network, label: null }}
                onChange={(option) => navigate(`/profile/${EIP3770[option.chainId]}:${address}`)}
              />
            </Box>
          )}
        </Box>

        <Box className="ProfileHeader__content" direction="vertical" fluid>
          <Heading mb={0}>
            <PrimaryLabel address={address} shouldTruncate={false} />
          </Heading>

          <Box mt="8px" align="center" className="ProfileHeader__address">
            <BadgeRow>
              <Badge
                mr="4px"
                color="grey"
                onClick={() => copy(address)}
                label={
                  copiedAddress
                    ? "Address copied to clipboard"
                    : isTablet
                    ? truncateAddress(address)
                    : address
                }
              />

              <ProfileAddress member={member} chainId={chainId} />
            </BadgeRow>

            <a href={blockExplorerAddress(chainId, address)} target="_blank" rel="noreferrer">
              <LinkOutIcon width="24px" />
            </a>
          </Box>

          <Box mt="4px" align="center" className="ProfileHeader__verification" fluid>
            {!isMobile && (
              <Select
                options={[...networks[Versions.V1], ...networks[Versions.V2]].map((n) => ({
                  ...n,
                  label: null,
                }))}
                defaultValue={{ ...network, label: null }}
                onChange={(option) => navigate(`/profile/${EIP3770[option.chainId]}:${address}`)}
              />
            )}

            {data && (
              <>
                <VerificationBadge
                  type="account"
                  label={data.account.is_contract_address ? "Contract address" : "EOA"}
                />

                {data.socials?.map((item, idx) => (
                  <VerificationBadge key={idx} type={item.dappname} label={item.profileName} />
                ))}
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Box className="ProfileButtons" direction="vertical" justify="space-between" minw="200px">
        {!isConnected ? (
          <ConnectButton />
        ) : connectedChain?.id !== Number(chainId) ? (
          <Button
            color="secondary"
            variant="light"
            icon={SwitchIcon}
            label={`Switch to ${network?.label}`}
            onClick={() => switchNetworkAsync(network?.chainId)}
          />
        ) : isMaxOverdue ? (
          <Button
            color="secondary"
            variant="light"
            icon={CancelIcon}
            label="Write-off debt"
            onClick={() =>
              open(PUBLIC_WRITE_OFF_DEBT_MODAL, {
                address,
              })
            }
          />
        ) : alreadyVouching ? (
          <Button
            color="secondary"
            variant="light"
            icon={ManageIcon}
            label="Manage Contact"
            onClick={() => navigate(`/contacts/providing?address=${address}`)}
          />
        ) : !connectedMember.isMember ? (
          <Button
            color="secondary"
            variant="light"
            to="/"
            mt="20px"
            as={Link}
            label="Register to vouch"
          />
        ) : (
          <Button
            color="secondary"
            variant="light"
            icon={VouchIcon}
            onClick={() => {
              open(VOUCH_MODAL, { address });
            }}
            label={network ? `Vouch on ${network.label}` : "Vouch"}
          />
        )}

        <Button
          icon={CopyIcon}
          mt="12px"
          color="secondary"
          variant="light"
          label="Copy profile link"
          onClick={() => copy(`https://app.union.finance${getProfileUrl(address, chainId)}`)}
        />
      </Box>
    </Box>
  );
}

const VerificationBadge = ({ type, label }) => {
  const Icon = () => {
    switch (type) {
      case "account":
        return <ProfileIcon />;
      case "farcaster":
        return <FarcasterIcon />;
      case "twitter":
        return <TwitterIcon />;
      case "lens":
        return <LensIcon />;
      default:
        return null;
    }
  };

  return (
    <Box className={cn("ProfileHeader__verification__item", type)} justify="center" align="center">
      <Icon />
      <Text>{label}</Text>
    </Box>
  );
};
