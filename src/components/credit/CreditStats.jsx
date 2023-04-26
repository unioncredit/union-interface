import "./CreditStats.scss";

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
import useRepayBlockNumber from "hooks/useRepayBlockNumber";
import cn from "classnames";

export default function CreditStats({ vouchers }) {
  const { open } = useModals();
  const { chain: connectedChain } = useNetwork();

  const { data: member = {} } = useMember();
  const { data: protocol = {} } = useProtocol();
  const { data: blockNumber } = useRepayBlockNumber({
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
    relative: relativeDueDate,
    absolute: absoluteDueDate,
    overdue: isOverdue,
  } = dueOrOverdueDate(
    lastRepay,
    overdueBlocks,
    blockNumber,
    connectedChain.id
  );

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
            color={
              owed.eq(ZERO) && creditLimit.gt(ZERO) ? "primary" : "secondary"
            }
            variant={
              owed.eq(ZERO) && creditLimit.gt(ZERO) ? "regular" : "light"
            }
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
          />

          <NumericalBlock
            fluid
            align="left"
            token="dai"
            size="regular"
            title="Unavailable"
            dotColor="amber500"
            value={format(unavailableBalance)}
          />
        </Box>
      </Card.Body>

      <Card.Footer align="center" justify="space-between">
        <Box direction="vertical">
          <Box align="center">
            {isOverdue && (
              <WarningIcon width="21px" style={{ marginRight: "6px" }} />
            )}

            <Text m={0} size="medium" weight="medium" grey={500}>
              {isOverdue ? `${relativeDueDate} Overdue` : "Next payment due"}
            </Text>
          </Box>

          <Badge
            mt="8px"
            label={`${format(minPayment)} DAI · ${absoluteDueDate}`}
            {...badgeProps}
          />
        </Box>

        <Button
          size="large"
          label="Make a payment"
          icon={RepayIcon}
          onClick={() => open(REPAY_MODAL)}
          {...buttonProps}
        />
      </Card.Footer>
    </Card>
  );
}
