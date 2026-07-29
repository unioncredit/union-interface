import "./FrozenStakeAlert.scss";

import { Box, Button, Card, CloseIcon, Text, WarningIcon } from "@unioncredit/ui";
import { Link } from "react-router-dom";

import format from "utils/format";
import { useToken } from "hooks/useToken";
import { useFrozenStakeAlert } from "hooks/useFrozenStakeAlert";
import useResponsive from "hooks/useResponsive";
import { AddressesAvatarBadgeRow } from "components/shared";

/**
 * Staker-side delinquency, surfaced where the member already is.
 *
 * The overdue detail has always existed on the Stake tab (StakeStats' Frozen
 * block) and in the contacts table, but a member who backs an overdue borrower
 * lands on Borrow and sees only their own credit — so frozen capital went
 * unnoticed until they happened to navigate. This renders across the credit
 * tabs whenever the member actually has stake frozen.
 */
export function FrozenStakeAlert() {
  const { token } = useToken();
  const { isMobile } = useResponsive();
  const { count, frozen, overdueVouchees, visible, dismiss } = useFrozenStakeAlert();

  if (!visible) return null;

  return (
    <Card mb="24px" className="FrozenStakeAlert">
      <Card.Body>
        {/* Box sets flex-direction as a prop, so the mobile stack has to be a
            prop too — a CSS media query loses to it (as CreditStats does). */}
        <Box
          direction={isMobile ? "vertical" : "horizontal"}
          align={isMobile ? "flex-start" : "center"}
          justify="space-between"
          className="FrozenStakeAlert__content"
        >
          <Box align="center" className="FrozenStakeAlert__summary">
            <WarningIcon className="FrozenStakeAlert__icon" width="24px" />

            <Box direction="vertical">
              <Text m={0} size="medium" weight="medium" grey={800}>
                {format(frozen, token)} {token} of your stake is frozen
              </Text>
              <Text m="2px 0 0" size="small" grey={500}>
                {count === 1
                  ? "A contact you back is overdue on their loan"
                  : `${count} contacts you back are overdue on their loans`}
              </Text>
            </Box>
          </Box>

          <Box align="center" className="FrozenStakeAlert__action">
            <AddressesAvatarBadgeRow
              mr="12px"
              className="FrozenStakeAlert__avatars"
              addresses={overdueVouchees.map((v) => v.address)}
            />

            <Button
              as={Link}
              to="/contacts/providing?filters=overdue"
              size="small"
              color="secondary"
              variant="light"
              label="View contacts"
            />

            <Button
              p="0 !important"
              ml="4px"
              size="small"
              color="secondary"
              variant="light"
              icon={CloseIcon}
              onClick={dismiss}
              aria-label="Dismiss"
              className="FrozenStakeAlert__dismiss"
              iconProps={{ style: { minWidth: "24px", minHeight: "24px" } }}
            />
          </Box>
        </Box>
      </Card.Body>
    </Card>
  );
}
