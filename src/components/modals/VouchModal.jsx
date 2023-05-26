import React, { useState } from "react";
import {
  ExpandingInfo,
  Modal,
  ModalOverlay,
  Input,
  Dai,
  Button,
  Box,
  WarningIcon,
  Text,
  HiddenInput,
  AddIcon,
  NumericalRows,
  VouchIcon,
} from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import { AddressInput, AddressSummary } from "components/shared";
import { useMember } from "providers/MemberData";
import useWrite from "hooks/useWrite";
import useForm from "hooks/useForm";
import useLabels from "hooks/useLabels";
import { useVouchers } from "providers/VouchersData";
import { useVouchees } from "providers/VoucheesData";
import { BlockSpeed, SECONDS_PER_DAY, ZERO } from "constants";
import { useVersion } from "providers/Version";
import { useProtocol } from "providers/ProtocolData";
import { useNetwork } from "wagmi";

export const VOUCH_MODAL = "vouch-modal";

export default function VouchModal({
  title = "New Vouch",
  subTitle = "",
  onClose,
  newMember = false,
  showAddressSummary = true,
  address: initialAddress = null,
}) {
  const { isV2 } = useVersion();
  const { close } = useModals();
  const { chain } = useNetwork();

  const { data: protocol } = useProtocol();
  const { refetch: refetchMember } = useMember();
  const { refetch: refetchVouchers } = useVouchers();
  const { refetch: refetchVouchees } = useVouchees();

  const { values, errors = {}, register } = useForm();
  const { setLabel } = useLabels();

  const [address, setAddress] = useState(initialAddress);

  const { overdueTime = ZERO, overdueBlocks = ZERO, maxOverdueTime = ZERO } = protocol;

  const versioned = (v1, v2) => (isV2 ? v2 : v1);

  const overdueDays = versioned(overdueBlocks, overdueTime.mul(1000))
    .mul(versioned(BlockSpeed[chain.id], 1))
    .div(SECONDS_PER_DAY * 1000)
    .toNumber();

  const maxOverdueDays = versioned(overdueBlocks, overdueTime.mul(1000))
    .add(maxOverdueTime.mul(1000))
    .mul(versioned(BlockSpeed[chain.id], 1))
    .div(SECONDS_PER_DAY * 1000)
    .toNumber();

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
          {address && showAddressSummary && <AddressSummary address={address} />}
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
                      content:
                        "How long an account can go without making at least a minimum payment",
                    },
                  },
                  {
                    label: "Time to write-off",
                    value: `${maxOverdueDays} days`,
                    tooltip: {
                      content:
                        "Time an account can be in default until it can be publicly written-off",
                    },
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
              If an account you vouch for doesn't pay the minimum due within 30 days, they'll be in
              a defaulted state. If they stay that way for 90 days, your stake could be lost
              permanently to cover their debt.
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
