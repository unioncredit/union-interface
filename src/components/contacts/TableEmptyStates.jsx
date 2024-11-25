import { Box, Button, Heading, ShareIcon, Text, VouchIcon } from "@unioncredit/ui";

import { ContactsType, ZERO } from "constants";
import { VOUCH_LINK_MODAL } from "../modals/VouchLinkModal";
import { useMember } from "providers/MemberData";
import { useToken } from "hooks/useToken";
import format from "utils/format";
import { VOUCH_MODAL } from "../modals/VouchModal";
import { useModals } from "../../providers/ModalManager";
import { useCallback } from "react";

const TableEmptyState = ({ title, content, buttonProps }) => {
  return (
    <Box direction="vertical" align="center" className="empty-state">
      <Heading size="large" level={1} align="center">
        {title}
      </Heading>
      <Text size="medium" grey={500} maxw="400px">
        {content}
      </Text>
      <Button mt="24px" w="100%" maxw="400px" {...buttonProps} />
    </Box>
  );
};

export const TableEmptyStates = ({ type, filters }) => {
  const { open } = useModals();
  const { token } = useToken();
  const { data: member = {} } = useMember();

  const { stakedBalance = ZERO } = member;

  const stateProps = useCallback(() => {
    if (type === ContactsType.VOUCHEES) {
      // Providing

      if (filters.includes("borrowing")) {
        return {
          title: "Your stake isn't being used",
          content: `Your stake of ${format(
            stakedBalance,
            token
          )} ${token} isn't being used currently, consider vouching for someone new.`,
          buttonProps: {
            icon: ShareIcon,
            label: "Share profile link",
            onClick: () => open(VOUCH_LINK_MODAL),
          },
        };
      }

      return {
        title: "You aren't backing anyone",
        content: `You have ${format(
          stakedBalance,
          token
        )} ${token} staked, consider vouching for someone you trust and extending them credit.`,
        buttonProps: {
          icon: VouchIcon,
          label: "New vouch",
          onClick: () => open(VOUCH_MODAL),
        },
      };
    } else {
      // Receiving
      return {
        title: "You have no backers",
        content:
          "To get credit on Union share your profile link with someon who is willing to back you.",
        buttonProps: {
          icon: ShareIcon,
          label: "Share profile link",
          onClick: () => open(VOUCH_LINK_MODAL),
        },
      };
    }
  }, [filters, stakedBalance, token, type]);

  return <TableEmptyState {...stateProps()} />;
};
