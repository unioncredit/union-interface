import "./VouchModal.scss";

import React, { useState } from "react";
import cn from "classnames";
import { Modal, ModalOverlay, Input, Dai, Button } from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import AddressInput from "components/shared/AddressInput";
import NewMemberModalHeader from "components/modals/NewMemberModalHeader";
import AddressSummary from "components/shared/AddressSummary";
import { useMember } from "providers/MemberData";
import useWrite from "hooks/useWrite";
import useForm from "hooks/useForm";

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
  showNewMemberHeader = false,
  showAddressSummary = true,
  address: initialAddress = null,
}) {
  const { close } = useModals();
  const { refetch: refetchMember } = useMember();
  const { values, errors = {}, register } = useForm();

  const [address, setAddress] = useState(initialAddress);

  const buttonProps = useWrite({
    contract: "userManager",
    method: "updateTrust",
    args: [address, values?.trust?.raw],
    enabled: values?.name?.length > 0 && values?.trust?.raw.gt(0) && address,
    onComplete: async () => {
      await refetchMember();
      close();
    },
  });

  return (
    <ModalOverlay onClick={close}>
      <Canvas />
      <Modal
        className={cn("VouchModal", {
          "VouchModal--newMember": showNewMemberHeader,
        })}
      >
        {showNewMemberHeader && <NewMemberModalHeader onClose={close} />}
        <Modal.Header onClose={close} title={title} subTitle={subTitle} />
        <Modal.Body>
          {showAddressSummary && <AddressSummary address={address} />}
          <AddressInput
            defaultValue={initialAddress}
            label="Address or ENS"
            onChange={setAddress}
          />
          <Input
            error={errors.name}
            label="Contact name"
            onChange={register("name")}
          />
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
