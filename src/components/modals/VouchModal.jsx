import "./VouchModal.scss";

import React, { useState } from "react";
import {
  AddIcon,
  Box,
  Button,
  ExpandingInfo,
  HiddenInput,
  Input,
  Modal,
  ModalOverlay,
  NumericalRows,
  Text,
  VouchIcon,
  WarningIcon,
} from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import { AddressInput, AddressSummary } from "components/shared";
import { useMember } from "providers/MemberData";
import useWrite from "hooks/useWrite";
import useForm from "hooks/useForm";
import useLabels from "hooks/useLabels";
import { useVouchers } from "providers/VouchersData";
import { useVouchees } from "providers/VoucheesData";
import { SECONDS_PER_DAY, ZERO } from "constants";
import { useProtocol } from "providers/ProtocolData";
import Token from "components/Token";

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

  const { data: protocol } = useProtocol();
  const { refetch: refetchMember } = useMember();
  const { refetch: refetchVouchers } = useVouchers();
  const { refetch: refetchVouchees } = useVouchees();
  const { values, errors = {}, register } = useForm();
  const { setLabel } = useLabels();

  const [address, setAddress] = useState(initialAddress);

  const { overdueTime = ZERO, maxOverdueTime = ZERO } = protocol;

  const overdueDays = Number((overdueTime * 1000n) / BigInt(SECONDS_PER_DAY * 1000));

  const maxOverdueDays = Number((maxOverdueTime * 1000n) / BigInt(SECONDS_PER_DAY * 1000));

  const buttonProps = useWrite({
    contract: "userManager",
    method: "updateTrust",
    args: [address, values?.trust?.raw],
    enabled: values?.trust?.raw > 0n && address,
    disabled: !address || values?.trust?.raw <= 0n,
    onComplete: async () => {
      await refetchMember();
      refetchVouchees();
      refetchVouchers();
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
      <Modal className="VouchModal">
        <Modal.Header onClose={handleClose} title={title} subTitle={subTitle} />
        <Modal.Body>
          {address && showAddressSummary && <AddressSummary address={address} />}
          <AddressInput
            defaultValue={initialAddress}
            label="Address or ENS of recipient"
            onChange={setAddress}
          />

          <Input
            mt="16px"
            type="number"
            suffix={<Token />}
            error={errors.trust}
            label="Trust amount"
            placeholder="0.0"
            onChange={register("trust")}
          />

          <Box fluid mt="16px">
            <HiddenInput
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
            </HiddenInput>
          </Box>

          <NumericalRows
            mt="24px"
            items={[
              {
                label: "Time to default",
                value: `${overdueDays} days`,
                tooltip: {
                  content: "How long an account can go without making at least a minimum payment",
                },
              },
              {
                label: "Time to write-off",
                value: `${maxOverdueDays} days`,
                tooltip: {
                  content: "Time an account can be in default until it can be publicly written-off",
                },
              },
            ]}
          />

          <ExpandingInfo
            mt="16px"
            icon={WarningIcon}
            title="Vouching puts your staked funds at risk"
          >
            <Text m={0}>
              If an account you vouch for doesn't pay the minimum due within {overdueDays} days,
              they'll be in a defaulted state. If they stay that way for {maxOverdueDays} days, your
              stake could be lost permanently to cover their debt.
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
