import "./CreditStats.scss";

import { useNetwork } from "wagmi";
import {
  Button,
  Card,
  Text,
  NumericalBlock,
  Box,
  DistributionBar,
  WarningIcon,
  BadgeIndicator,
  CalendarIcon,
} from "@unioncredit/ui";
import cn from "classnames";
import { BigNumber } from "ethers";

import { ZERO } from "constants";
import format, { formattedNumber } from "utils/format";
import { dueOrOverdueDate, NoPaymentLabel } from "utils/dueDate";
import { reduceBnSum } from "utils/reduce";
import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";
import { REPAY_MODAL } from "components/modals/RepayModal";
import { useModals } from "providers/ModalManager";
import { BORROW_MODAL } from "components/modals/BorrowModal";
import { useVersion } from "providers/Version";
import { useVersionBlockNumber } from "hooks/useVersionBlockNumber";
import useResponsive from "hooks/useResponsive";
import makeUrls from "add-event-to-calendar";

export default function CreditStats({ vouchers }) {
  const { open } = useModals();
  const { chain: connectedChain } = useNetwork();
  const { isV2 } = useVersion();
  const { isMobile } = useResponsive();

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
    overdueBlocks = ZERO,
    overdueTime = ZERO,
    maxOverdueTime = ZERO,
  } = { ...member, ...protocol };

  const vouch = vouchers.map(({ vouch }) => vouch).reduce(reduceBnSum, ZERO);

  const unavailableBalance = vouch.sub(creditLimit).sub(owed);
  const overdueUnit = isV2 ? overdueTime : overdueBlocks;

  const {
    date: dueDate,
    relative: relativeDueDate,
    absolute: absoluteDueDate,
    overdue: isOverdue,
  } = dueOrOverdueDate(lastRepay, overdueUnit, blockNumber, connectedChain.id);

  const maxOverdueTotal = (overdueTime || overdueBlocks).add(maxOverdueTime);
  const isMaxOverdue =
    isOverdue &&
    lastRepay &&
    isV2 &&
    BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

  const buttonProps = relativeDueDate === NoPaymentLabel && {
    disabled: true,
    color: "secondary",
    variant: "light",
  };

  const urls = makeUrls({
    location: "",
    name: "Union repayment reminder",
    details: "Reminder to repay your loan on https://app.union.finance/",
    startsAt: dueDate || new Date(),
    endsAt: dueDate || new Date(),
  });

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
            title="Available to Borrow"
            align="left"
            smallDecimals={true}
            value={format(creditLimit)}
          />

          <Button
            size="large"
            label="Borrow"
            className="BorrowButton"
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
              color: "violet400",
            },
            {
              value: formattedNumber(unavailableBalance),
              color: "amber500",
            },
          ]}
        />

        <Box className="CreditStats__BorrowStats" align="center" justify="space-between">
          <NumericalBlock
            fluid
            align="left"
            token="dai"
            size="regular"
            title="Borrowed"
            dotColor="blue300"
            value={format(owed)}
            titleTooltip={{
              content: "The amount of DAI you are currently borrowing",
            }}
          />

          <NumericalBlock
            fluid
            align="left"
            token="dai"
            size="regular"
            title="Available"
            dotColor="violet400"
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
                "Credit normally available to you which is tied up elsewhere and unavailable to borrow at this time",
            }}
          />
        </Box>
      </Card.Body>

      <Card.Footer direction="vertical">
        <Box mb="24px" align="center" justify="space-between" fluid>
          <NumericalBlock
            token="dai"
            title="Balance owed"
            align="left"
            value={format(owed)}
            smallDecimals={true}
          />

          <Box>
            <Button
              size="large"
              color="secondary"
              variant="light"
              label={isMobile ? "Repay" : "Make a payment"}
              className="RepayButton"
              onClick={() => open(REPAY_MODAL)}
              {...buttonProps}
            />
          </Box>
        </Box>

        <Box
          direction={isMobile ? "vertical" : "horizontal"}
          justify="space-between"
          align={isMobile ? "flex-start" : "center"}
          fluid
        >
          <Box className="PaymentDueInfo" direction="vertical">
            <Box align="center">
              {isOverdue && <WarningIcon width="21px" style={{ marginRight: "6px" }} />}

              <Text m={0} size="medium" weight="medium" grey={500}>
                {isOverdue ? `${relativeDueDate} Overdue` : "Next payment due"}
              </Text>
            </Box>

            {isMaxOverdue ? (
              <BadgeIndicator mt="8px" color="red500" textColor="red500" label="Write-Off" />
            ) : (
              <Text m="4px 0 0" size="medium">
                {owed.lte(0) ? "No payment due" : `${format(minPayment)} DAI · ${absoluteDueDate}`}
              </Text>
            )}
          </Box>

          {!isOverdue && owed.gt(0) && (
            <Button
              as="a"
              href={urls.ics}
              size="small"
              color="secondary"
              variant="light"
              icon={CalendarIcon}
              className="PaymentReminderButton"
              download={`Payment Due ${absoluteDueDate}.ics`}
              label="Create payment reminder"
            />
          )}
        </Box>

        {isMaxOverdue && (
          <Text className="MaxOverdueNotice" m="16px 0 0 0" size="medium">
            When you’re in an overdue state for the maximum time, you enter a “write-off” state.
            Your backers risk permanent loss of all funds due to public write-off of your unpaid
            balance.
          </Text>
        )}
      </Card.Footer>
    </Card>
  );
}
