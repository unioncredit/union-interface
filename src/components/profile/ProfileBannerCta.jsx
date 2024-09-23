import "./ProfileBannerCta.scss";

import cn from "classnames";
import { Box, Button, Card, Heading, Text } from "@unioncredit/ui";
import { useMember, useMemberData } from "../../providers/MemberData";
import { useModals } from "../../providers/ModalManager";
import { VOUCH_MODAL } from "../modals/VouchModal";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import format from "utils/format";
import { ZERO } from "constants";
import { usePrimaryName } from "hooks/usePrimaryName";

export const ProfileBannerCta = ({ address }) => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { open: openModal } = useModals();
  const { data: connectedMember } = useMember();
  const { data: profileMember } = useMemberData(address);
  const { data: name } = usePrimaryName({
    address,
    defaultValue: "them",
  });

  const { isMember: connectedIsMember = false, creditLimit: connectedCreditLimit = ZERO } =
    connectedMember;

  const { isMember: profileIsMember = false, creditLimit: profileCreditLimit = ZERO } =
    profileMember;

  if (!isConnected) {
    return null;
  }

  const data = connectedIsMember
    ? profileIsMember
      ? {
          title: "Vouch for a new contact",
          content:
            "Vouch for a friend or trusted contact by using your staked assets. Make sure it's someone you really trust.",
          buttonProps: {
            label: "Vouch for someone",
            onClick: () => openModal(VOUCH_MODAL),
          },
        }
      : {
          title: "Gift a Membership",
          content: `${
            profileCreditLimit.gt(ZERO)
              ? `This account has $${format(profileCreditLimit)} in credit. `
              : ""
          }Mint a membership NFT and gift it to them for free membership.`,
          buttonProps: {
            label: "Mint to gift a membership",
            onClick: () =>
              open(
                "https://zora.co/collect/oeth:0xa73be24fb5df82f45c5848f099451b5bea427474/2?referrer=0x729dF3924822C9a2CA1995c05Eb801A395329F35"
              ),
          },
        }
    : {
        title: `Become a member to back ${name}`,
        content: `Register your address to access ${
          connectedCreditLimit.gt(ZERO)
            ? `your $${format(connectedCreditLimit)} in credit and `
            : ""
        }all the benefits of being a member of union credit network.`,
        buttonProps: {
          label: "Get started",
          onClick: () => {
            navigate("/");
          },
        },
      };

  const { title, content, buttonProps } = data;

  return (
    <Card
      mb="24px"
      className={cn("ProfileBannerCta", {
        "ProfileBannerCta--purple": connectedIsMember && !profileIsMember,
      })}
    >
      <Card.Body>
        <Box direction="vertical" align="center" fluid>
          <Heading level={2} size="large" mb="16px">
            {title}
          </Heading>
          <Text size="large" align="center" mb="24px">
            {content}
          </Text>
          <Box fluid>
            <Button fluid size="large" {...buttonProps} />
          </Box>
        </Box>
      </Card.Body>
    </Card>
  );
};
