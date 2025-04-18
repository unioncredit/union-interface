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
import { useState, useEffect } from "react";

export const GettingStartedPanel = () => {
  const CACHE_KEY = "getting_started_hidden";
  const [isLoading, setIsLoading] = useState(true);

  const { cache, cached } = useCache();
  const { data: vouchees = [], isLoading: voucheesLoading } = useVouchees();
  const { data: vouchers = [], isLoading: vouchersLoading } = useVouchers();
  const { data: { stakedBalance = ZERO }, isLoading: memberLoading } = useMember();
  const { open: openModal } = useModals();

  useEffect(() => {
    // Only set loading to false when all data has finished loading
    if (!voucheesLoading && !vouchersLoading && !memberLoading) {
      setIsLoading(false);
    }
  }, [voucheesLoading, vouchersLoading, memberLoading]);

  // Hide panel while loading or if cached
  if (isLoading || cached(CACHE_KEY)) return null;
  
  // Show panel if user has no vouchers or no staked balance
  if (vouchers.length === 0 && stakedBalance === ZERO) {
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
  }

  return null;
};
