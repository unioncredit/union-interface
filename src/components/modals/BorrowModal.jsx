import {
  Box,
  Button,
  Dai,
  Grid,
  Input,
  Label,
  Modal,
  ModalOverlay,
  Stat,
} from "@unioncredit/ui";

import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import useForm from "hooks/useForm";
import { ZERO } from "constants";
import { Errors } from "constants";
import { useProtocol } from "providers/ProtocolData";
import { calculateMaxBorrow } from "utils/numbers";
import { WAD } from "constants";
import useWrite from "hooks/useWrite";
import useFirstPaymentDueDate from "../../hooks/useFirstPaymentDueDate";

export const BORROW_MODAL = "borrow-modal";

export default function BorrowModal() {
  const { close } = useModals();
  const { data: member, refetch: refetchMember } = useMember();
  const { data: protocol } = useProtocol();
  const firstPaymentDueDate = useFirstPaymentDueDate();

  const {
    owed = ZERO,
    minBorrow = ZERO,
    creditLimit = ZERO,
    originationFee = ZERO,
  } = { ...member, ...protocol };

  const validate = (inputs) => {
    if (member.isOverdue) {
      return Errors.IS_OVERDUE;
    } else if (inputs.amount.raw.gt(creditLimit)) {
      return Errors.INSUFFICIENT_CREDIT_LIMIT;
    } else if (inputs.amount.raw.lt(minBorrow)) {
      return Errors.MIN_BORROW(minBorrow);
    }
  };

  const {
    register,
    values = {},
    errors = {},
    empty,
    setRawValue,
  } = useForm({ validate });

  const amount = values.amount || empty;

  const maxBorrow = calculateMaxBorrow(creditLimit, originationFee);

  const fee = amount.raw.mul(originationFee).div(WAD);

  const borrow = amount.raw.add(fee);

  const newOwed = borrow.add(owed);

  const buttonProps = useWrite({
    contract: "uToken",
    method: "borrow",
    args: [amount.raw],
    enabled: amount.raw.gt(ZERO) && !errors.amount,
    onComplete: async () => {
      await refetchMember();
      close();
    },
  });

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="BorrowModal">
        <Modal.Header title="Borrow funds" onClose={close} />
        <Modal.Body>
          {/*--------------------------------------------------------------
            Stats Before 
          *--------------------------------------------------------------*/}
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <Stat
                  size="medium"
                  align="center"
                  label="Available credit"
                  value={<Dai value={format(creditLimit)} />}
                />
              </Grid.Col>
              <Grid.Col>
                <Stat
                  size="medium"
                  align="center"
                  label="You owe"
                  value={<Dai value={format(owed)} />}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
          {/*--------------------------------------------------------------
            Input 
          *--------------------------------------------------------------*/}
          <Box mt="24px">
            <Input
              type="number"
              name="amount"
              label="Borrow"
              suffix={<Dai />}
              placeholder="0.0"
              error={errors.amount}
              value={amount.display}
              onChange={register("amount")}
              caption={`Max. ${format(maxBorrow)} DAI`}
              onCaptionButtonClick={() => setRawValue("amount", maxBorrow)}
            />
          </Box>
          {/*--------------------------------------------------------------
            Stats After 
          *--------------------------------------------------------------*/}
          <Box justify="space-between" mt="16px">
            <Label as="p" size="small" grey={400}>
              Total including fee
            </Label>
            <Label as="p" size="small" grey={700}>
              {format(borrow)} DAI
            </Label>
          </Box>
          <Box justify="space-between">
            <Label as="p" size="small" grey={400}>
              First Payment Due
            </Label>
            <Label as="p" size="small" grey={700}>
              {firstPaymentDueDate}
            </Label>
          </Box>
          <Box justify="space-between">
            <Label as="p" size="small" grey={400}>
              New balance owed
            </Label>
            <Label as="p" size="small" grey={700}>
              {format(newOwed)} DAI
            </Label>
          </Box>
          {/*--------------------------------------------------------------
            Button 
          *--------------------------------------------------------------*/}
          <Button
            fluid
            mt="18px"
            label={`Borrow ${amount.display} DAI`}
            disabled={amount.raw.lte(ZERO)}
            {...buttonProps}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
