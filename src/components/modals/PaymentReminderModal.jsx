import {
  Box,
  Label,
  Modal,
  ModalOverlay,
  Text,
  Button,
  ButtonRow,
} from "@unioncredit/ui";
import { useMemo } from "react";
import makeUrls from "add-event-to-calendar";
import { mainnet, useBlockNumber, useNetwork } from "wagmi";
import { ReactComponent as Calendar } from "@unioncredit/ui/lib/icons/calendar.svg";

import format from "utils/format";
import dueDate from "utils/dueDate";
import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";
import { useModals } from "providers/ModalManager";

export const PAYMENT_REMINDER_MODAL = "payment-reminder-modal";

export default function PaymentReminderModal() {
  const { close } = useModals();
  const { chain: connectedChain } = useNetwork();
  const { data: member = {} } = useMember();
  const { data: protocol = {} } = useProtocol();
  const { data: blockNumber } = useBlockNumber({
    chainId: mainnet.id,
  });

  const date = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
  }, []);

  const calendarData = {
    location: "",
    name: "Union repayment reminder",
    details: "Reminder to repay your loan on https://union.finance",
    startsAt: date,
    endsAt: date,
  };

  const urls = makeUrls(calendarData);

  const {
    interest = ZERO,
    lastRepay = ZERO,
    overdueBlocks = ZERO,
  } = { ...member, ...protocol };

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="PaymentReminderModal">
        <Modal.Header title="Payment reminder" onClose={close} />
        <Modal.Body>
          <Text align="center" mb="24px">
            Save your payment due date to your calendar to avoid entering a
            defaulted state on your loan.
          </Text>
          <Box justify="space-between" mt="24px">
            <Label as="p" size="small" grey={400}>
              First payment amount
            </Label>
            <Label as="p" size="small" grey={400}>
              {format(interest)} DAI
            </Label>
          </Box>
          <Box justify="space-between" mt="4px">
            <Label as="p" size="small" grey={400}>
              First payment due
            </Label>
            <Label as="p" size="small" grey={400}>
              {dueDate(
                lastRepay,
                overdueBlocks,
                blockNumber,
                connectedChain.id
              )}
            </Label>
          </Box>
          <ButtonRow
            align="center"
            justify="center"
            mt="18px"
            direction="vertical"
          >
            <Text mb="16px">
              <Label
                as="a"
                variant="lite"
                download="Union payment reminder"
                target="_blank"
                rel="norefferer"
                href={urls.ics}
                color="blue500"
                fluid
              >
                Download .ICS file
              </Label>
            </Text>
            <Button
              as="a"
              target="_blank"
              rel="norefferer"
              href={urls.google}
              label="Add to Google calendar"
              fluid
              icon={Calendar}
            />
          </ButtonRow>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
