import "./CreditStats.scss";

import cn from "classnames";
import { useAccount } from "wagmi";
import makeUrls from "add-event-to-calendar";
import {
  BadgeIndicator,
  BorrowIcon,
  Box,
  Button,
  CalendarIcon,
  Card,
  DistributionBar,
  Dot,
  Heading,
  InfoOutlinedIcon,
  NumericalBlock,
  RepayIcon,
  Text,
  Tooltip,
  WarningIcon,
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
import useResponsive from "hooks/useResponsive";
import { useToken } from "hooks/useToken";

export default function CreditStats({ vouchers }) {
  const { open } = useModals();
  const { chain: connectedChain } = useAccount();
  const { isMobile } = useResponsive();
  const { token } = useToken();

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

  const unavailableBalance = vouch - creditLimit - owed;

  const {
    date: dueDate,
    relative: relativeDueDate,
    absolute: absoluteDueDate,
    overdue: isOverdue,
  } = dueOrOverdueDate(lastRepay, overdueTime, blockNumber, connectedChain.id);

  const maxOverdueTotal = overdueTime + maxOverdueTime;
  const isMaxOverdue = isOverdue && lastRepay && BigInt(blockNumber) >= lastRepay + maxOverdueTotal;

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
            token={`${token.toLowerCase()}`}
            title="Available to Borrow"
            align="left"
            smallDecimals={true}
            value={format(creditLimit, token)}
          />

          <Button
            size="large"
            label="Borrow"
            icon={BorrowIcon}
            className="BorrowButton"
            onClick={() => open(BORROW_MODAL)}
          />
        </Box>

        <DistributionBar
          m="24px 0 12px"
          items={[
            {
              value: formattedNumber(owed, token),
              color: "blue300",
            },
            {
              value: formattedNumber(creditLimit, token, 2, false),
              color: "blue800",
            },
            {
              value: formattedNumber(unavailableBalance, token),
              color: "amber500",
            },
          ]}
        />

        <Box className="CreditStats__BorrowStats" align="center">
          <Box align="center" className="CreditStats__Legend">
            <Dot color="blue300" mr="4px" />

            <Heading level={3} grey={500} m={0} weight="medium" size="small">
              Borrowed
              <Tooltip
                ml="4px"
                title={`${format(owed, token)} ${token}`}
                content={`The amount of ${token} you are currently borrowing`}
              >
                <InfoOutlinedIcon width="13px" />
              </Tooltip>
            </Heading>
          </Box>

          <Box align="center" className="CreditStats__Legend">
            <Dot color="blue800" mr="4px" />

            <Heading level={3} grey={500} m={0} weight="medium" size="small">
              Available
              <Tooltip
                ml="4px"
                title={`${format(creditLimit, token, 2, false)} ${token}`}
                content={`The amount of ${token} currently available to borrow`}
              >
                <InfoOutlinedIcon width="13px" />
              </Tooltip>
            </Heading>
          </Box>

          <Box align="center" className="CreditStats__Legend">
            <Dot color="amber500" mr="4px" />

            <Heading level={3} grey={500} m={0} weight="medium" size="small">
              Unavailable
              <Tooltip
                ml="4px"
                title={`${format(unavailableBalance, token)} ${token}`}
                content="Credit normally available to you which is tied up elsewhere and unavailable to borrow at this time"
              >
                <InfoOutlinedIcon width="13px" />
              </Tooltip>
            </Heading>
          </Box>
        </Box>
      </Card.Body>

      <Card.Footer direction="vertical">
        <Box mb="24px" align="center" justify="space-between" fluid>
          <NumericalBlock
            token={`${token.toLowerCase()}`}
            title="Balance owed"
            align="left"
            value={format(owed, token)}
            smallDecimals={true}
          />

          <Box>
            <Button
              size="large"
              color="secondary"
              variant="light"
              icon={RepayIcon}
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
                {owed <= 0n
                  ? "No payment due"
                  : `${format(minPayment, token)} ${token} · ${absoluteDueDate}`}
              </Text>
            )}
          </Box>

          {!isOverdue && owed > 0n && (
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
