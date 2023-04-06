import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  Input,
  Dai,
  Button,
  Box,
  ExpandingInfo,
  WarningIcon,
  Text,
  ButtonReveal,
  AddIcon,
  NumericalLines,
  VouchIcon,
} from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import { AddressInput, AddressSummary } from "components/shared";
import { useMember } from "providers/MemberData";
import useWrite from "hooks/useWrite";
import useForm from "hooks/useForm";
import useLabels from "hooks/useLabels";

export const VOUCH_MODAL = "vouch-modal";

export default function VouchModal({
  title = "New Vouch",
  subTitle = "",
  onClose,
  newMember = false,
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
      if (values.name) {
        setLabel(address, values.name);
      }

      await refetchMember();
      close();
    },
  });

  const handleClose = () => {
    onClose?.();
    close();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <Modal className="VouchModal">
        <Modal.Header onClose={handleClose} title={title} subTitle={subTitle} />
        <Modal.Body>
          {address && showAddressSummary && (
            <AddressSummary address={address} />
          )}
          <AddressInput
            defaultValue={initialAddress}
            label="Address or ENS of recipient"
            onChange={setAddress}
          />

          {address && (
            <>
              <Input
                mt="16px"
                type="number"
                suffix={<Dai />}
                error={errors.trust}
                label="Trust amount"
                onChange={register("trust")}
              />

              <Box fluid mt="16px">
                <ButtonReveal
                  w="100%"
                  title="Contact alias"
                  buttonProps={{
                    w: "100%",
                    h: "40px",
                    icon: AddIcon,
                    size: "small",
                    color: "secondary",
                    variant: "light",
                    label: "Add a contact alias",
                  }}
                >
                  <Input error={errors.name} onChange={register("name")} />
                </ButtonReveal>
              </Box>

              <NumericalLines
                mt="24px"
                items={[
                  {
                    label: "Time to default",
                    value: "30 days",
                  },
                  {
                    label: "Time to write-off",
                    value: "90 days",
                  },
                ]}
              />
            </>
          )}

          <ExpandingInfo
            mt="16px"
            icon={WarningIcon}
            title="Vouching puts your staked funds at risk"
          >
            <Text m={0}>
              If an account you vouch for doesn't pay the minimum due within 30
              days, they'll be in a defaulted state. If they stay that way for
              90 days, your stake could be lost permanently to cover their debt.
            </Text>
          </ExpandingInfo>

          {newMember ? (
            <>
              <Button
                fluid
                mt="16px"
                size="large"
                label="Confirm vouch"
                icon={VouchIcon}
                {...buttonProps}
              />

              <Button
                fluid
                mt="8px"
                size="large"
                color="secondary"
                variant="light"
                label="Skip for now"
                onClick={handleClose}
              />
            </>
          ) : (
            <Button fluid mt="16px" label="Submit Vouch" {...buttonProps} />
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
