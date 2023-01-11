import "./VouchModal.scss";

import React, { useState } from "react";
import cn from "classnames";
import { Modal, ModalOverlay, Input, Dai, Button, Box } from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import AddressInput from "components/shared/AddressInput";
import NewMemberModalHeader from "components/modals/NewMemberModalHeader";
import AddressSummary from "components/shared/AddressSummary";
import { useMember } from "providers/MemberData";
import useWrite from "hooks/useWrite";
import useForm from "hooks/useForm";
import useLabels from "hooks/useLabels";

export const VOUCH_MODAL = "vouch-modal";

const Canvas = React.memo(() => (
  <canvas
    id="confettiCanvas"
    style={{
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
    }}
  />
));

export default function VouchModal({
  title = "New Vouch",
  subTitle = "",
  onClose = null,
  showNewMemberHeader = false,
  showAddressSummary = true,
  address: initialAddress = null,
}) {
  const { close } = useModals();
  const { refetch: refetchMember } = useMember();
  const { values, errors = {}, register } = useForm();
  const { setLabel } = useLabels();

  const [address, setAddress] = useState(initialAddress);

  const buttonProps = useWrite({
    contract: "userManager",
    method: "updateTrust",
    args: [address, values?.trust?.raw],
    enabled: values?.trust?.raw.gt(0) && address,
    onComplete: async () => {
      await refetchMember();
      if (values.name) {
        setLabel(address, values.name);
      }
      close();
    },
  });

  const handleClose = () => {
    onClose?.();
    close();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <Canvas />
      <Modal
        className={cn("VouchModal", {
          "VouchModal--newMember": showNewMemberHeader,
        })}
      >
        {showNewMemberHeader && <NewMemberModalHeader onClose={handleClose} />}
        <Modal.Header onClose={handleClose} title={title} subTitle={subTitle} />
        <Modal.Body>
          {showAddressSummary && <AddressSummary address={address} />}
          <AddressInput
            defaultValue={initialAddress}
            label="Address or ENS"
            onChange={setAddress}
          />
          <Box fluid mt="16px">
            <Input
              error={errors.name}
              label="Contact name"
              onChange={register("name")}
            />
          </Box>
          <Input
            type="number"
            suffix={<Dai />}
            error={errors.trust}
            label="Trust amount"
            onChange={register("trust")}
          />
          <Button fluid mt="16px" label="Submit Vouch" {...buttonProps} />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
