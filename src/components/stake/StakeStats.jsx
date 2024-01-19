import "./StakeStats.scss";

import {
  Button,
  Card,
  NumericalBlock,
  ButtonRow,
  Box,
  WithdrawIcon,
  DepositIcon,
  DistributionBar,
} from "@unioncredit/ui";

import format, { formattedNumber } from "utils/format";
import { ZERO } from "constants";
import { reduceBnSum } from "utils/reduce";
import { useVouchees } from "providers/VoucheesData";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import { STAKE_MODAL } from "components/modals/StakeModal";
import { StakeType } from "constants";
import { AddressesAvatarBadgeRow } from "components/shared";
import { Link } from "react-router-dom";

export default function StakeStats() {
  const { open } = useModals();
  const { data: member = {} } = useMember();
  const { data: vouchees = [] } = useVouchees();
  const { stakedBalance = ZERO, totalLockedStake = ZERO } = member;

  const withdrawableStake = stakedBalance.sub(totalLockedStake);
  const borrowingVouchees = vouchees.filter((v) => v.locking.gt(ZERO));
  const defaultedVouchees = vouchees.filter((v) => v.isOverdue);
  const defaulted = defaultedVouchees.map((v) => v.locking).reduce(reduceBnSum, ZERO);

  return (
    <Card className="StakeStats">
      <Card.Body>
        <Box fluid align="center" justify="space-between" className="StakeStats__top">
          <NumericalBlock
            token="dai"
            align="left"
            title="Your staked balance"
            value={format(stakedBalance)}
          />

          <ButtonRow>
            <Button
              size="large"
              label="Withdraw"
              color="secondary"
              variant="light"
              icon={WithdrawIcon}
              onClick={() => open(STAKE_MODAL, { type: StakeType.UNSTAKE })}
            />

            <Button
              size="large"
              label="Deposit"
              icon={DepositIcon}
              className="DepositButton"
              onClick={() => open(STAKE_MODAL, { type: StakeType.STAKE })}
            />
          </ButtonRow>
        </Box>

        <DistributionBar
          m="24px 0"
          items={[
            {
              value: formattedNumber(withdrawableStake),
              color: "blue500",
            },
            {
              value: formattedNumber(totalLockedStake),
              color: "violet500",
            },
            {
              value: formattedNumber(defaulted),
              color: "red500",
            },
          ]}
        />

        <Box align="center" justify="space-between" className="StakeStats__bottom">
          <Box fluid className="StakeStats__item">
            <NumericalBlock
              align="left"
              token="dai"
              size="regular"
              title="Withdrawable"
              dotColor="blue500"
              value={format(withdrawableStake)}
            />

            <AddressesAvatarBadgeRow
              mt="8px"
              className="Withdrawable"
              addresses={vouchees.map((v) => v.address)}
              showLabel={true}
              label={`Providing to ${vouchees.length ? vouchees.length : "no"} contacts`}
            />
          </Box>

          <Box fluid className="StakeStats__item">
            <NumericalBlock
              fluid
              align="left"
              token="dai"
              size="regular"
              title="Locked"
              dotColor="violet500"
              value={format(totalLockedStake)}
            />

            <Link to="/contacts/providing?filters=borrowing">
              <AddressesAvatarBadgeRow
                mt="8px"
                addresses={borrowingVouchees.map((v) => v.address)}
                label={`${
                  borrowingVouchees.length ? borrowingVouchees.length : "No"
                } Contacts Borrowing`}
                showLabel={!borrowingVouchees.length || borrowingVouchees.length > 6}
              />
            </Link>
          </Box>

          <Box fluid className="StakeStats__item">
            <NumericalBlock
              fluid
              align="left"
              token="dai"
              size="regular"
              title="Frozen"
              dotColor="red500"
              value={format(defaulted)}
            />

            <Link to="/contacts/providing?filters=overdue">
              <AddressesAvatarBadgeRow
                mt="8px"
                addresses={defaultedVouchees.map((v) => v.address)}
                label={`${defaultedVouchees.length ? defaultedVouchees.length : "No"} Defaulters`}
                showLabel={!defaultedVouchees.length || defaultedVouchees.length > 6}
              />
            </Link>
          </Box>
        </Box>
      </Card.Body>
    </Card>
  );
}
