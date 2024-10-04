import "./ProfileHeader.scss";

import { Box, Text } from "@unioncredit/ui";

import { ProfileVerifiedAccounts } from "./ProfileVerifiedAccounts";
import { ProfileCtaButtons } from "./ProfileCtaButtons";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileHeaderContent } from "./ProfileHeaderContent";
import { useFarcasterData } from "../../hooks/useFarcasterData";

export default function ProfileHeader({ address, chainId }) {
  const { data: farcasterData } = useFarcasterData({ address });
  const { bio } = farcasterData;

  return (
    <Box
      fluid
      direction="vertical"
      justify="space-between"
      align="space-between"
      className="ProfileHeader"
    >
      <Box className="ProfileHeader__header" align="center">
        <Box className="ProfileHeader__card" align="center" fluid>
          <ProfileAvatar address={address} chainId={chainId} />
          <ProfileHeaderContent address={address} chainId={chainId} />
        </Box>

        <ProfileCtaButtons
          address={address}
          chainId={chainId}
          className="ProfileCtaButtons--desktop"
        />
      </Box>

      {bio && (
        <Text m="24px 0 -8px" grey={500} size="medium">
          {bio}
        </Text>
      )}

      <ProfileVerifiedAccounts address={address} chainId={chainId} />

      <ProfileCtaButtons
        address={address}
        chainId={chainId}
        className="ProfileCtaButtons--mobile"
      />
    </Box>
  );
}
