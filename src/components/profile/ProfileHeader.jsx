import "./ProfileHeader.scss";

import cn from "classnames";
import { Text, Box, Heading, LinkOutIcon, ProfileIcon, Select } from "@unioncredit/ui";

import { Avatar, PrimaryLabel } from "../shared";
import { blockExplorerAddress } from "utils/blockExplorer";
import { EIP3770 } from "constants";
import { Versions } from "providers/Version";
import { useEffect, useState } from "react";
import { ReactComponent as FarcasterIcon } from "../../images/verification/farcaster.svg";
import { ReactComponent as TwitterIcon } from "../../images/verification/twitter.svg";
import { ReactComponent as LensIcon } from "../../images/verification/lens.svg";
import useResponsive from "../../hooks/useResponsive";
import { truncateAddress } from "../../utils/truncateAddress";
import { networks } from "../../config/networks";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ address, chainId }) {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  const [data, setData] = useState(null);

  const network =
    [...networks[Versions.V1], ...networks[Versions.V2]].find(
      (network) => network.chainId === parseInt(chainId)
    ) || networks[Versions.V1][0];

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
    >
      <Box className="ProfileHeader__avatar">
        <Avatar address={address} size={112} />
      </Box>

      <Box className="ProfileHeader__content" direction="vertical">
        <Heading mb={0}>
          <PrimaryLabel address={address} shouldTruncate={true} />
        </Heading>

        <Box mt="4px" align="flex-end" className="ProfileHeader__address">
          <Text m="0 8px 1px 0" grey={500} size="medium">
            {isTablet ? truncateAddress(address) : address}
          </Text>

          <a href={blockExplorerAddress(chainId, address)} target="_blank" rel="noreferrer">
            <LinkOutIcon width="24px" />
          </a>
        </Box>

        <Box mt="12px" align="center" className="ProfileHeader__verification" fluid>
          <Select
            options={[...networks[Versions.V1], ...networks[Versions.V2]].map((n) => ({
              ...n,
              label: null,
            }))}
            defaultValue={{ ...network, label: null }}
            onChange={(option) => navigate(`/profile/${EIP3770[option.chainId]}:${address}`)}
          />

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
