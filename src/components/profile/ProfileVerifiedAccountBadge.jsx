import cn from "classnames";
import { Box, ProfileIcon, Text } from "@unioncredit/ui";

import { ReactComponent as FarcasterIcon } from "images/verification/farcaster.svg";
import { ReactComponent as TwitterIcon } from "images/verification/twitter.svg";
import { ReactComponent as LensIcon } from "images/verification/lens.svg";
import { ReactComponent as BaseNameIcon } from "images/verification/base.svg";
import { ReactComponent as GitHubIcon } from "images/verification/github.svg";
import { ReactComponent as LinkedInIcon } from "images/verification/linkedin.svg";
import { blockExplorerAddress } from "utils/blockExplorer";

export const ProfileVerifiedAccountBadge = ({ type, url, label, chainId, address }) => {
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
      case "basename":
        return <BaseNameIcon style={{ width: "16px", height: "16px" }} />;
      case "github":
        return <GitHubIcon style={{ width: "16px", height: "16px" }} />;
      case "linkedin":
        return <LinkedInIcon style={{ width: "16px", height: "16px" }} />;
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
    <a href={url || getLink()} target="_blank" rel="noreferrer">
      <Box className={cn("ProfileVerifiedAccounts__item", type)} justify="center" align="center">
        <Icon />
        <Text>{clean(label)}</Text>
      </Box>
    </a>
  );
};
