import { useMemo } from "react";
import makeUrls from "add-event-to-calendar";
import { Box, Label, Modal, ModalOverlay, Text, Button } from "@unioncredit/ui";
import { ReactComponent as Calendar } from "@unioncredit/ui/lib/icons/calendar.svg";

export const PAYMENT_REMINDER_MODAL = "payment-reminder-modal";

export default function PaymentReminderModal() {
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
              {format(format(interest))} DAI
            </Label>
          </Box>
          <Box justify="space-between" mt="4px">
            <Label as="p" size="small" grey={400}>
              First payment due
            </Label>
            <Label as="p" size="small" grey={400}>
              {paymentDueDate}
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
