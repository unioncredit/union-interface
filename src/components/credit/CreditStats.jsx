import "./CreditStats.scss";

import cn from "classnames";
import { BigNumber } from "ethers";
import { useNetwork } from "wagmi";
import {
  Button,
  Card,
  Text,
  NumericalBlock,
  Box,
  DistributionBar,
  BorrowIcon,
  Badge,
  RepayIcon,
  WarningIcon,
  BadgeIndicator,
} from "@unioncredit/ui";

import { ZERO } from "constants";
import format, { formattedNumber } from "utils/format";
import { dueOrOverdueDate, NoPaymentLabel } from "utils/dueDate";
import { reduceBnSum } from "utils/reduce";
import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";
import { REPAY_MODAL } from "components/modals/RepayModal";
import { useModals } from "providers/ModalManager";
import { BORROW_MODAL } from "components/modals/BorrowModal";
import { useVersionBlockNumber } from "hooks/useVersionBlockNumber";

export default function CreditStats({ vouchers }) {
  const { open } = useModals();
  const { chain: connectedChain } = useNetwork();

  const { data: member = {} } = useMember();
  const { data: protocol = {} } = useProtocol();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId: connectedChain.id,
  });

  const {
    creditLimit = ZERO,
    minPayment = ZERO,
    owed = ZERO,
    lastRepay = ZERO,
    overdueTime = ZERO,
    maxOverdueTime = ZERO,
  } = { ...member, ...protocol };

  const vouch = vouchers.map(({ vouch }) => vouch).reduce(reduceBnSum, ZERO);

  const unavailableBalance = vouch.sub(creditLimit).sub(owed);

  const {
    relative: relativeDueDate,
    absolute: absoluteDueDate,
    overdue: isOverdue,
  } = dueOrOverdueDate(lastRepay, overdueTime, blockNumber, connectedChain.id);

  const maxOverdueTotal = overdueTime.add(maxOverdueTime);
  const isMaxOverdue =
    isOverdue && lastRepay && BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

  const badgeProps = isOverdue
    ? { color: "red" }
    : owed.lte(ZERO)
    ? { color: "grey", label: "No balance due" }
    : { color: "blue" };

  const buttonProps = relativeDueDate === NoPaymentLabel && {
    disabled: true,
    color: "secondary",
    variant: "light",
  };

  return (
    <Card
      className={cn("CreditStats", {
        "CreditStats--overdue": isOverdue,
      })}
    >
      <Card.Body>
        <Box align="center" justify="space-between">
          <NumericalBlock
            token="dai"
            title="Balance due"
            dotColor="blue300"
            align="left"
            value={format(owed)}
          />

          <Button
            size="large"
            label="Borrow"
            color={owed.eq(ZERO) && creditLimit.gt(ZERO) ? "primary" : "secondary"}
            variant={owed.eq(ZERO) && creditLimit.gt(ZERO) ? "regular" : "light"}
            icon={BorrowIcon}
            onClick={() => open(BORROW_MODAL)}
          />
        </Box>

        <DistributionBar
          m="24px 0"
          items={[
            {
              value: formattedNumber(owed),
              color: "blue300",
            },
            {
              value: formattedNumber(creditLimit, 2, false),
              color: "blue600",
            },
            {
              value: formattedNumber(unavailableBalance),
              color: "amber500",
            },
          ]}
        />

        <Box align="center" justify="space-between">
          <NumericalBlock
            fluid
            align="left"
            token="dai"
            size="regular"
            title="Available"
            dotColor="blue600"
            value={format(creditLimit, 2, false)}
            titleTooltip={{
              content: "The amount of DAI currently available to borrow",
            }}
          />

          <NumericalBlock
            fluid
            align="left"
            token="dai"
            size="regular"
            title="Unavailable"
            dotColor="amber500"
            value={format(unavailableBalance)}
            titleTooltip={{
              content:
                "Credit normally available to you which is tied up elsewhere and unavailable to borrow at this time.",
            }}
          />
        </Box>
      </Card.Body>

      <Card.Footer direction="vertical">
        <Box justify="space-between" align="center" fluid>
          <Box direction="vertical">
            <Box align="center">
              {isOverdue && <WarningIcon width="21px" style={{ marginRight: "6px" }} />}

              <Text m={0} size="medium" weight="medium" grey={500}>
                {isOverdue ? `${relativeDueDate} Overdue` : "Next payment due"}
              </Text>
            </Box>

            {isMaxOverdue ? (
              <BadgeIndicator mt="8px" color="red500" textColor="red500" label="Write-Off" />
            ) : (
              <Badge
                mt="8px"
                label={`${format(minPayment)} DAI · ${absoluteDueDate}`}
                {...badgeProps}
              />
            )}
          </Box>

          <Button
            size="large"
            label="Make a payment"
            icon={RepayIcon}
            onClick={() => open(REPAY_MODAL)}
            {...buttonProps}
          />
        </Box>

        {isMaxOverdue && (
          <Text m="16px 0 0 0" size="medium">
            When you’re in an overdue state for the maximum time, you enter a “write-off” state.
            Your backers risk permanent loss of all funds due to public write-off of your unpaid
            balance.
          </Text>
        )}
      </Card.Footer>
    </Card>
  );
}
