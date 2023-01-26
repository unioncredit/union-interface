import {
  Box,
  Button,
  Dai,
  Grid,
  Input,
  Text,
  Modal,
  ModalOverlay,
  Stat,
} from "@unioncredit/ui";

import { ContactsType } from "constants";
import { compareAddresses } from "utils/compare";
import { useModals } from "providers/ModalManager";
import { MANAGE_CONTACT_MODAL } from "./ManageContactModal";
import { useVouchees } from "providers/VoucheesData";
import { ZERO } from "constants";
import format from "utils/format";
import { Errors } from "constants";
import useForm from "hooks/useForm";
import useWrite from "hooks/useWrite";

export const WRITE_OFF_DEBT_MODAL = "write-off-debt-modal";

export default function WriteOffDebtModal({ address }) {
  const { close, open } = useModals();
  const { data: vouchees = [], refetch: refetchVouchees } = useVouchees();

  const vouchee = vouchees.find((v) => compareAddresses(v.address, address));

  const { locking = ZERO, vouch = ZERO, isOverdue } = vouchee || {};

  const back = () =>
    open(MANAGE_CONTACT_MODAL, {
      contact: vouchee,
      type: ContactsType.VOUCHEES,
    });

  const validate = (inputs) => {
    if (inputs.amount?.raw.gt(locking)) {
      return Errors.EXCEEDED_LOCK;
    }
  };

  const {
    register,
    errors = {},
    values = {},
    setRawValue,
    empty,
  } = useForm({ validate });

  const amount = values.amount || empty;

  const buttonProps = useWrite({
    contract: "userManager",
    method: "debtWriteOff",
    args: [vouchee.address, amount.raw],
    enabled: isOverdue && vouchee?.address && amount.raw.gt(ZERO),
    onComplete: async () => {
      await refetchVouchees();
      back();
    },
  });

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="WriteOffDebt">
        <Modal.Header title="Write-off debt" onClose={close} onBack={back} />
        <Modal.Body>
          {/*-------------------------------------------------------------
           * Stats
           *-----------------------------------------------------------*/}
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <Stat
                  size="medium"
                  align="center"
                  label="Vouch"
                  value={<Dai value={format(vouch)} />}
                />
              </Grid.Col>
              <Grid.Col>
                <Stat
                  size="medium"
                  align="center"
                  label="Unpaid debt"
                  value={<Dai value={format(locking)} />}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
          {/*-------------------------------------------------------------
           * Inputs
           *-----------------------------------------------------------*/}
          <Input
            type="number"
            label="Value"
            suffix={<Dai />}
            error={errors.amount}
            onChange={register("amount")}
            onCaptionButtonClick={() => setRawValue("amount", locking)}
            caption={`Write off max. ${format(locking)} DAI`}
          />
          <Box justify="space-between" mt="16px">
            <Text size="small" m={0}>
              New balance owed
            </Text>
            <Text size="small" m={0}>
              {format(locking.sub(amount.raw))}
            </Text>
          </Box>
          <Text align="center" as="p" size="small" color="red500" mt="16px">
            When you write-off debt, your locked funds are consumed, this action
            cannot be undone.
          </Text>
          <Button fluid label="Write-off debt" {...buttonProps} />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
