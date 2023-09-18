import "./ProfileHeader.scss";

import {
  Text,
  Badge,
  Box,
  Heading,
  Avatar as UiAvatar,
  BadgeRow,
  LinkOutIcon,
  BadgeIndicator,
  ProfileIcon,
} from "@unioncredit/ui";
import { BigNumber } from "ethers";

import { Avatar, PrimaryLabel } from "../shared";
import { blockExplorerAddress } from "utils/blockExplorer";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { useVersionBlockNumber } from "hooks/useVersionBlockNumber";
import { EIP3770, ZERO } from "constants";
import { useProtocol } from "providers/ProtocolData";
import { useVersion } from "providers/Version";
import useNetworks from "../../hooks/useNetworks";
import { useEffect, useState } from "react";
import { ReactComponent as FarcasterIcon } from "../../images/verification/farcaster.svg";
import { ReactComponent as TwitterIcon } from "../../images/verification/twitter.svg";
import { ReactComponent as LensIcon } from "../../images/verification/lens.svg";
import useResponsive from "../../hooks/useResponsive";
import { truncateAddress } from "../../utils/truncateAddress";

const ProfileAddress = ({ profileMember, chainId }) => {
  const { isV2 } = useVersion();
  const { data: protocol } = useProtocol();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId,
  });

  const { isMember = false, isOverdue = false, lastRepay = ZERO } = profileMember;
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

export default function ProfileHeader({ address, profileMember, chainId }) {
  const networks = useNetworks(true);
  const { isMobile, isTablet } = useResponsive();

  const [copiedAddress, copyAddress] = useCopyToClipboard();
  const [data, setData] = useState(null);

  const targetNetwork = networks.find((network) => network.chainId === Number(chainId));

  useEffect(() => {
    fetch(`https://identity.union.finance/address/${address}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        console.log(err.message);
      });
  }, [address]);

  return (
    <Box
      align="flex-start"
      direction={isMobile ? "vertical" : "horizontal"}
      className="ProfileHeader"
      style={{
        background: `radial-gradient(circle at 60% -20%, rgba(207,207,254,1) 40%, rgba(251,214,93,1) 60%, rgba(124,239,117,1) 100%)`,
      }}
    >
      <Box className="ProfileHeader__avatar">
        <Avatar address={address} size={112} />

        <div className="ProfileHeader__avatar__network">
          <UiAvatar src={targetNetwork?.imageSrc} size={28} />
        </div>
      </Box>

      <Box className="ProfileHeader__content" direction="vertical">
        <Heading mb={0}>
          <PrimaryLabel address={address} shouldTruncate={false} />
        </Heading>

        <Box mt="8px" align="center" className="ProfileHeader__address">
          <BadgeRow>
            <Badge
              mr="4px"
              color="grey"
              onClick={() => copyAddress(address)}
              label={
                copiedAddress
                  ? "Address copied to clipboard"
                  : isTablet
                  ? truncateAddress(address)
                  : `${EIP3770[chainId]}:${address}`
              }
            />

            <ProfileAddress profileMember={profileMember} chainId={chainId} />
          </BadgeRow>

          <a href={blockExplorerAddress(chainId, address)} target="_blank" rel="noreferrer">
            <LinkOutIcon width="24px" />
          </a>
        </Box>

        {data && (
          <Box className="ProfileHeader__verification">
            <VerificationBadge
              type="account"
              label={data.account.is_contract_address ? "Contract address" : "EOA"}
            />

            {data.socials?.map((item, idx) => (
              <VerificationBadge key={idx} type={item.dappname} label={item.profileName} />
            ))}
          </Box>
        )}
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
    <Box className="ProfileHeader__verification__item" justify="center">
      <Icon />
      <Text>{label}</Text>
    </Box>
  );
};
