import "./ProfileHeader.scss";

import { Box, Button, CopyIcon, Text } from "@unioncredit/ui";

import { useModals } from "../../providers/ModalManager";
import { SHARE_REFERRAL_MODAL } from "../modals/ShareReferralModal";
import { ProfileVerifiedAccounts } from "./ProfileVerifiedAccounts";
import { ProfilePrimaryCta } from "./ProfilePrimaryCta";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileHeaderContent } from "./ProfileHeaderContent";
import { useFarcasterData } from "../../hooks/useFarcasterData";

export default function ProfileHeader({ address, chainId }) {
  const { open } = useModals();
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

        <ProfilePrimaryCta address={address} chainId={chainId} />
      </Box>

      <Text m="24px 0 -8px" grey={500} size="medium">
        {bio}
      </Text>

      <ProfileVerifiedAccounts address={address} chainId={chainId} />

      <Button
        icon={CopyIcon}
        mt="16px"
        variant="light"
        color="secondary"
        label={"Share profile"}
        onClick={() =>
          open(SHARE_REFERRAL_MODAL, {
            address,
            chainId,
          })
        }
      />
    </Box>
  );
}
