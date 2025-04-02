import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  NumericalBlock,
  NumericalRows,
  Text,
  Toggle,
  Tooltip,
} from "@unioncredit/ui";

import format from "utils/format";
import useForm from "hooks/useForm";
import { useModals } from "providers/ModalManager";
import { useVouchee, useVouchees } from "providers/VoucheesData";
import { Errors, ZERO } from "constants";
import { MANAGE_CONTACT_MODAL } from "./ManageContactModal";
import useWrite from "hooks/useWrite";
import { AddressSummary } from "components/shared";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import Token from "components/Token";
import { useToken } from "hooks/useToken";

export const EDIT_VOUCH_MODAL = "edit-vouch-modal";

export default function EditVouchModal({
  address,
  nextContact,
  prevContact,
  contactIndex,
  contactsCount,
  clearContact,
}) {
  const [revokeVouch, setRevokeVouch] = useState(false);

  const navigate = useNavigate();
  const { close, open } = useModals();
  const { token } = useToken();
  const { refetch: refetchVouchees } = useVouchees();
  const { address: stakerAddress } = useAccount();
  const vouchee = useVouchee(address);
  const { locking = ZERO, trust = ZERO } = vouchee;

  const back = () =>
    open(MANAGE_CONTACT_MODAL, {
      address,
      nextContact,
      prevContact,
      contactIndex,
      contactsCount,
      clearContact,
    });

  const validate = (inputs) => {
    if (inputs.amount.raw < locking) {
      return Errors.TRUST_LT_LOCKING;
    }
  };

  const handleClose = () => {
    clearContact?.();
    close();
  };

  const { register, errors = {}, values = {}, empty } = useForm({ validate });

  const amount = values.amount || empty;

  const updateTrustButtonProps = useWrite({
    contract: "userManager",
    method: "updateTrust",
    args: [address, amount.raw],
    enabled: amount.raw >= locking,
    onComplete: async () => {
      await refetchVouchees();
      back();
    },
  });

  const cancelVouchButtonProps = useWrite({
    contract: "userManager",
    method: "cancelVouch",
    args: [stakerAddress, address], // staker, borrower
    enabled: locking <= ZERO,
    onComplete: async () => {
      navigate(0);
    },
  });

  return (
    <ModalOverlay onClick={handleClose}>
      <Modal className="EditVouchModal">
        <Modal.Header onClose={handleClose} noHeight hideClose>
          <AddressSummary m={0} address={address} />
        </Modal.Header>
        <Modal.Body>
          <Modal.Container direction="vertical">
            <NumericalBlock
              align="left"
              token={token.toLowerCase()}
              title="Trust you provide"
              value={format(trust, token)}
            />

            <Input
              mt="16px"
              type="number"
              suffix={<Token />}
              label="New trust amount"
              onChange={register("amount")}
              error={errors.amount}
              placeholder="0"
              disabled={revokeVouch}
            />

            <NumericalRows
              m="20px 0"
              items={[
                {
                  label: "Utilized trust",
                  value: `${format(locking, token)} ${token}`,
                  tooltip: {
                    shrink: true,
                    content: "Your stake currently backing someone you vouched for",
                    position: "right",
                  },
                },
              ]}
            />

            <Tooltip
              enabled={locking > ZERO}
              title="Cannot revoke vouch"
              content="Vouches can only be cancelled if a contact has no outstanding debt"
            >
              <Toggle
                mb="8px"
                active={revokeVouch}
                disabled={locking > ZERO}
                label="Revoke vouch you provide"
                labelPosition="end"
                onChange={() => setRevokeVouch((v) => !v)}
              />
            </Tooltip>

            {revokeVouch && (
              <Text m="0 0 8px" size="small" grey={600}>
                Revoking a vouch sets the trust you provide to zero and completely cancels the vouch
                this contact receives from you.
              </Text>
            )}

            <Button
              fluid
              mt="4px"
              label={`${revokeVouch ? "Revoke" : "Update"} trust`}
              {...(revokeVouch ? cancelVouchButtonProps : updateTrustButtonProps)}
            />

            <Button fluid mt="8px" label="Back" color="secondary" variant="light" onClick={back} />
          </Modal.Container>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
