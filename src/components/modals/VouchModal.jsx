import "./VouchModal.scss";

import React, { useState } from "react";
import cn from "classnames";
import {
  ExpandingInfo,
  Modal,
  ModalOverlay,
  Input,
  Dai,
  Button,
  Box,
  Text,
} from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import AddressInput from "components/shared/AddressInput";
import NewMemberModalHeader from "components/modals/NewMemberModalHeader";
import AddressSummary from "components/shared/AddressSummary";
import { useMember } from "providers/MemberData";
import useWrite from "hooks/useWrite";
import useForm from "hooks/useForm";
import useLabels from "hooks/useLabels";
import { useVouchers } from "providers/VouchersData";
import { useVouchees } from "providers/VoucheesData";
import { useVersion } from "providers/Version";

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
  const { version } = useVersion();

  const { refetch: refetchMember } = useMember();
  const { refetch: refetchVouchers } = useVouchers();
  const { refetch: refetchVouchees } = useVouchees();

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
      await refetchVouchees();
      await refetchVouchers();
      if (values.name) {
        setLabel(address, values.name);
      }
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

          {version === "v2" && (
            <ExpandingInfo title="Vouching puts your staked funds at risk">
              <Text m={0} style={{ fontSize: 14 }}>
                If an account you vouch for doesn't pay the minimum due within
                30 days, they'll be in a defaulted state. If they stay that way
                for 90 days, your stake could be lost permanently to cover their
                debt.
              </Text>
            </ExpandingInfo>
          )}

          <Button fluid mt="16px" label="Submit Vouch" {...buttonProps} />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
