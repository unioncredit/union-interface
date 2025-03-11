import "./GettingStartedPanel.scss";

import { Link } from "react-router-dom";
import { ArrowRightIcon, Box, Button, Card, CloseIcon, Heading, Text } from "@unioncredit/ui";

import { VOUCH_LINK_MODAL } from "../modals/VouchLinkModal";
import { useModals } from "providers/ModalManager";
import { useCache } from "providers/Cache";
import { useMember } from "providers/MemberData";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import { Links, ZERO } from "constants";
import format from "utils/format";

export const GettingStartedPanel = () => {
  const CACHE_KEY = "getting_started_hidden";

  const { cache, cached } = useCache();
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();
  const { data: member = {} } = useMember();
  const { open: openModal } = useModals();

  const { stakedBalance = ZERO } = member;

  if ((vouchers.length > 0 && stakedBalance.gt(ZERO)) || cached(CACHE_KEY)) return null;

  return (
    <Card mb="24px" className="GettingStartedPanel">
      <Card.Header
        title="Getting Started on Union"
        action={
          <Button
            p="0 !important"
            size="small"
            color="secondary"
            variant="light"
            onClick={() => cache(CACHE_KEY, true)}
            icon={CloseIcon}
            iconProps={{
              style: {
                minWidth: "24px",
                minHeight: "24px",
              },
            }}
          />
        }
      />
      <Card.Body>
        <Text size="medium" grey={500} m={0}>
          On Union, each member can be borrower and/or lender. If you are just getting started we
          recommend staking $10 and vouching for a few friends. Vouching is fun!
        </Text>

        <Box mt="16px" className="gap-4 sm:!flex-col">
          <Card variant="blue">
            <Card.Body>
              <Heading align="center">Be a Lender</Heading>
              <Text size="medium" color="blue500" m={0} align="center">
                You currently have ${format(stakedBalance)} staked backing {vouchees.length}{" "}
                contacts.
              </Text>
              <Button
                as={Link}
                fluid
                mt="16px"
                label="Stake"
                icon={ArrowRightIcon}
                iconPosition="end"
                to={Links.STAKE}
              />
            </Card.Body>
          </Card>
          <Card variant="blue">
            <Card.Body>
              <Heading align="center">Be a Borrower</Heading>
              <Text size="medium" color="blue500" m={0} align="center">
                To get credit a friend will need to vouch for you.
              </Text>
              <Button
                fluid
                mt="16px"
                label="Share with friends"
                onClick={() => openModal(VOUCH_LINK_MODAL)}
              />
            </Card.Body>
          </Card>
        </Box>
      </Card.Body>
    </Card>
  );
};
