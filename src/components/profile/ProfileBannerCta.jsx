import "./ProfileBannerCta.scss";

import cn from "classnames";
import { Box, Button, Card, Heading, Text } from "@unioncredit/ui";
import { useMember, useMemberData } from "../../providers/MemberData";
import { useModals } from "../../providers/ModalManager";
import { VOUCH_MODAL } from "../modals/VouchModal";
import { useNavigate } from "react-router-dom";
import { useAccount, useBalance } from "wagmi";
import format from "utils/format";
import { ZERO } from "constants";
import { usePrimaryName } from "hooks/usePrimaryName";
import { compareAddresses } from "../../utils/compare";
import useWrite from "../../hooks/useWrite";
import { useProtocol } from "../../providers/ProtocolData";
import { reduceBnSum } from "../../utils/reduce";

export const ProfileBannerCta = ({ vouchers, address }) => {
  const navigate = useNavigate();
  const { address: connectedAddress, isConnected } = useAccount();
  const { open: openModal } = useModals();
  const { data: protocol } = useProtocol();
  const { data: connectedMember } = useMember();
  const { data: profileMember, isLoading, refetch: refetchProfileMember } = useMemberData(address);
  const { data: name } = usePrimaryName({
    address,
    defaultValue: "them",
  });
  const { data: balance } = useBalance({
    address: connectedAddress,
  });

  const {
    isMember: connectedIsMember = false,
    creditLimit: connectedCreditLimit = ZERO,
    borrowerAddresses: connectedBorrowers = [],
  } = connectedMember;

  const { isMember: profileIsMember = false } = profileMember;

  const profileCreditLimit = vouchers.map(({ vouch }) => vouch).reduce(reduceBnSum, ZERO);

  const {
    regFee = ZERO,
    rebate = ZERO,
    value: connectedEthBalance = ZERO,
  } = { ...protocol, ...balance };

  const ethRegisterFee = regFee.add(rebate);
  const canRegisterUser = ethRegisterFee.lte(connectedEthBalance);
  const registerButtonProps = useWrite({
    contract: "registerHelper",
    method: "register",
    args: [address, connectedAddress],
    enabled: connectedIsMember && !profileIsMember && canRegisterUser,
    disabled: !canRegisterUser,
    onComplete: async () => {
      await refetchProfileMember();
    },
    overrides: {
      value: ethRegisterFee,
    },
  });

  const alreadyVouching = connectedBorrowers.some((borrower) =>
    compareAddresses(borrower, address)
  );

  const data = connectedIsMember
    ? profileIsMember
      ? connectedAddress === address
        ? {
            title: "Edit your profile",
            content:
              "Add a bio to your profile by linking your farcaster account to your union address",
            buttonProps: {
              label: "Edit on Warpcast",
              onClick: () => open("https://warpcast.com/~/settings"),
            },
          }
        : vouchers.length <= 0
        ? {
            title: `Be ${name === "them" ? "their" : name + "'s"} first backer!`,
            content: "If you trust them, vouch for them and be their first supporter.",
            buttonProps: {
              label: `Vouch for ${name}`,
              onClick: () => openModal(VOUCH_MODAL, { address }),
            },
          }
        : alreadyVouching
        ? {
            title: `Update Vouch`,
            content: `You are already vouching for ${name}. Update your vouch for ${name} by using your staked assets.`,
            buttonProps: {
              label: "Vouch",
              onClick: () => openModal(VOUCH_MODAL, { address }),
            },
          }
        : {
            title: `Vouch for ${name}`,
            content: `Vouch for ${name} by using your staked assets. Make sure they are someone you really trust.`,
            buttonProps: {
              label: "Vouch",
              onClick: () => openModal(VOUCH_MODAL, { address }),
            },
          }
      : {
          title: "Gift a Membership",
          content: `${
            profileCreditLimit.gt(ZERO)
              ? `This account has $${format(profileCreditLimit)} in credit from ${
                  vouchers.length
                } members. `
              : ""
          }Mint a membership NFT and gift it to them for free membership.`,
          buttonProps: {
            label: canRegisterUser ? "Mint to gift a membership" : "Not enough funds",
            ...registerButtonProps,
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

  if (!isConnected || isLoading) {
    return null;
  }

  return (
    <Card
      mb="24px"
      className={cn("ProfileBannerCta", {
        "ProfileBannerCta--purple":
          (connectedIsMember && !profileIsMember) || connectedAddress === address,
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
