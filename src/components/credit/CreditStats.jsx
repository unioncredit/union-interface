import "./CreditStats.scss";

import { useNetwork } from "wagmi";
import {
  Box,
  Button,
  CalendarIcon,
  Card,
  DistributionBar,
  Dot,
  Heading,
  InfoOutlinedIcon,
  NumericalBlock,
  Text,
  Tooltip,
  WarningIcon,
} from "@unioncredit/ui";
import cn from "classnames";

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
import makeUrls from "add-event-to-calendar";

export default function CreditStats({ vouchers }) {
  const { open } = useModals();
  const { chain: connectedChain } = useNetwork();
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
  } = { ...member, ...protocol };

  const vouch = vouchers.map(({ vouch }) => vouch).reduce(reduceBnSum, ZERO);

  const unavailableBalance = vouch.sub(creditLimit).sub(owed);

  const {
    date: dueDate,
    relative: relativeDueDate,
    absolute: absoluteDueDate,
    overdue: isOverdue,
  } = dueOrOverdueDate(lastRepay, overdueBlocks, blockNumber, connectedChain.id);

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
          m="24px 0 12px"
          items={[
            {
              value: formattedNumber(owed),
              color: "blue300",
            },
            {
              value: formattedNumber(creditLimit, 2, false),
              color: "blue800",
            },
            {
              value: formattedNumber(unavailableBalance),
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
                title={`${format(owed)} DAI`}
                content="The amount of DAI you are currently borrowing"
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
                title={`${format(creditLimit, 2, false)} DAI`}
                content="The amount of DAI currently available to borrow"
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
                title={`${format(unavailableBalance)} DAI`}
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

            <Text m="4px 0 0" size="medium">
              {owed.lte(0) ? "No payment due" : `${format(minPayment)} DAI · ${absoluteDueDate}`}
            </Text>
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
      </Card.Footer>
    </Card>
  );
}
