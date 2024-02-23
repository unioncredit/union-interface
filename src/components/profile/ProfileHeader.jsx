import "./ProfileHeader.scss";

import cn from "classnames";
import {
  Badge,
  BadgeIndicator,
  BadgeRow,
  Box,
  Button,
  CancelIcon,
  CopyIcon,
  Heading,
  LinkOutIcon,
  ManageIcon,
  ProfileIcon,
  Select,
  SwitchIcon,
  Text,
  VouchIcon,
} from "@unioncredit/ui";

import { compareAddresses } from "utils/compare";

import { Avatar, ConnectButton, PrimaryLabel } from "../shared";
import { blockExplorerAddress } from "utils/blockExplorer";
import { EIP3770, ZERO, ZERO_ADDRESS } from "constants";
import { getVersion, Versions } from "providers/Version";
import { useEffect, useMemo, useState } from "react";
import { ReactComponent as FarcasterIcon } from "images/verification/farcaster.svg";
import { ReactComponent as TwitterIcon } from "images/verification/twitter.svg";
import { ReactComponent as LensIcon } from "images/verification/lens.svg";
import { truncateAddress } from "../../utils/truncateAddress";
import { supportedNetworks } from "config/networks";
import { Link, useNavigate } from "react-router-dom";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useMember, useMemberData } from "../../providers/MemberData";
import { BigNumber } from "ethers";
import { PUBLIC_WRITE_OFF_DEBT_MODAL } from "../modals/PublicWriteOffDebtModal";
import { useVersionBlockNumber } from "../../hooks/useVersionBlockNumber";
import { useProtocol } from "../../providers/ProtocolData";
import { VOUCH_MODAL } from "../modals/VouchModal";
import { useModals } from "../../providers/ModalManager";
import { useSupportedNetwork } from "../../hooks/useSupportedNetwork";
import { SHARE_REFERRAL_MODAL } from "../modals/ShareReferralModal";

const ProfileAddress = ({ member, chainId }) => {
  const { data: protocol } = useProtocol();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId,
  });

  const { isMember = false, isOverdue = false, lastRepay = ZERO } = member;
  const { overdueTime = ZERO, maxOverdueTime = ZERO } = protocol;

  const maxOverdueTotal = overdueTime.add(maxOverdueTime);

  const isMaxOverdue =
    isOverdue && lastRepay && BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

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
  const { data: connectedMember = {} } = useMember();
  const { data: member } = useMemberData(address, chainId, getVersion(chainId));
  const { data: protocol } = useProtocol();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { isSupported } = useSupportedNetwork();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId,
  });

  const [data, setData] = useState(null);
  const [copiedAddress, copyAddress] = useCopyToClipboard();

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

  const networks = supportedNetworks.filter((n) => isSupported(n.chainId));

  const network = useMemo(() => {
    return networks.find((network) => network.chainId === chainId) || networks[0];
  }, [chainId, networks]);

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
    <Box fluid justify="space-between" align="flex-start" className="ProfileHeader">
      <Box className="ProfileHeader__card" fluid>
        <Box className="ProfileHeader__avatar" align="flex-start" justify="space-between">
          <Avatar address={address} size={112} />

          <Box className="ProfileHeader__NetworkSelect">
            <Select
              options={networks.map((n) => ({
                ...n,
                label: null,
              }))}
              defaultValue={{ ...network, label: null }}
              onChange={(option) => navigate(`/profile/${EIP3770[option.chainId]}:${address}`)}
            />
          </Box>
        </Box>

        <Box className="ProfileHeader__content" direction="vertical" fluid>
          <Heading mb={0}>
            <PrimaryLabel address={address} shouldTruncate={true} />
          </Heading>

          <Box mt="8px" align="center" className="ProfileHeader__address">
            <BadgeRow>
              <Badge
                mr="4px"
                color="grey"
                onClick={() => copyAddress(address)}
                label={copiedAddress ? "Address copied" : truncateAddress(address)}
              />

              <ProfileAddress member={member} chainId={chainId} />
            </BadgeRow>

            <a href={blockExplorerAddress(chainId, address)} target="_blank" rel="noreferrer">
              <LinkOutIcon width="24px" />
            </a>
          </Box>

          <Box mt="4px" align="center" className="ProfileHeader__verification" fluid>
            {data && (
              <>
                <VerificationBadge
                  type="account"
                  chainId={chainId}
                  address={address}
                  label={data.account.is_contract_address ? "Contract address" : "EOA"}
                />

                {data.socials?.map((item, idx) => (
                  <VerificationBadge
                    key={idx}
                    chainId={chainId}
                    address={address}
                    type={item.dappname}
                    label={item.profileName}
                  />
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
          label={"Share profile"}
          onClick={() =>
            open(SHARE_REFERRAL_MODAL, {
              address,
              chainId,
            })
          }
        />
      </Box>
    </Box>
  );
}

const VerificationBadge = ({ type, label, chainId, address }) => {
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

  const getLink = () => {
    switch (type) {
      case "account":
        return blockExplorerAddress(chainId, address);
      case "farcaster":
        return `https://warpcast.com/${clean(label)}`;
      case "twitter":
        return `https://twitter.com/${clean(label)}`;
      case "lens":
        return `https://hey.xyz/u/${clean(label)}`;
      default:
        return null;
    }
  };

  const clean = (input) => {
    return input.replace("lens/@", "");
  };

  return (
    <a href={getLink()} target="_blank" rel="noreferrer">
      <Box
        className={cn("ProfileHeader__verification__item", type)}
        justify="center"
        align="center"
      >
        <Icon />
        <Text>{clean(label)}</Text>
      </Box>
    </a>
  );
};
