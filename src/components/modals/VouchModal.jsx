import "./VouchModal.scss";

import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  Input,
  Dai,
  Button,
  Box,
  Text,
  HiddenInput,
  AddIcon,
  VouchIcon,
  SteppedSection,
  IconLabel,
  SteppedSections,
  DaiIcon,
  Toggle,
  TextArea,
  ControlRows,
} from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import { AddressInput } from "components/shared";
import { useMember } from "providers/MemberData";
import useWrite from "hooks/useWrite";
import useForm from "hooks/useForm";
import useLabels from "hooks/useLabels";
import { useVouchers } from "providers/VouchersData";
import { useVouchees } from "providers/VoucheesData";
import { useVersion } from "providers/Version";
import { EnsIconLabel } from "../shared/EnsIconLabel";
import SendVouchNoteButton from "../shared/SendVouchNoteButton";

export const VOUCH_MODAL = "vouch-modal";

function VoucheeSection({
  active,
  complete,
  address,
  setAddress,
  register,
  errors,
  onContinue,
  onEdit,
}) {
  return (
    <SteppedSection active={active} complete={complete}>
      <SteppedSection.CollapsedHeader onEditClick={onEdit}>
        {complete && address ? (
          <Box align="center">
            <Text m={0} grey={700} size="medium">
              Vouching for
            </Text>

            <EnsIconLabel address={address} />
          </Box>
        ) : (
          <Text m={0} grey={400} size="medium">
            Who are you vouching for?
          </Text>
        )}
      </SteppedSection.CollapsedHeader>

      <SteppedSection.Header>
        <Box direction="vertical">
          <Text m={0} grey={800} size="medium">
            Who are you vouching for?
          </Text>
          <Text m={0} grey={600}>
            Enter the address or ENS for the entity you'd like to vouch for. It's important that you
            trust this entity with your money.
          </Text>
        </Box>
      </SteppedSection.Header>

      <SteppedSection.Body direction="vertical">
        <AddressInput defaultValue={address} label="Address or ENS" onChange={setAddress} />

        {address && (
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
        )}

        <Button fluid mt="16px" label="Continue" disabled={!address} onClick={onContinue} />
      </SteppedSection.Body>
    </SteppedSection>
  );
}

function TrustAmountSection({ trust, active, complete, register, errors, onEdit, onContinue }) {
  return (
    <SteppedSection active={active} complete={complete}>
      <SteppedSection.CollapsedHeader onEditClick={onEdit}>
        {complete && trust ? (
          <Box align="center">
            <Text m={0} grey={700} size="medium">
              Trusting with
            </Text>

            <IconLabel ml="8px" icon={DaiIcon} label={trust.formatted} />
          </Box>
        ) : (
          <Text m={0} grey={400} size="medium">
            How much do you trust them?
          </Text>
        )}
      </SteppedSection.CollapsedHeader>

      <SteppedSection.Header>
        <Box direction="vertical">
          <Text m={0} grey={800} size="medium">
            How much do you trust them?
          </Text>
          <Text m={0} grey={600}>
            Enter an amount of DAI to represent your trust towards them.
          </Text>
        </Box>
      </SteppedSection.Header>

      <SteppedSection.Body direction="vertical">
        <Input
          type="number"
          suffix={<Dai />}
          error={errors.trust}
          label="Trust amount"
          onChange={register("trust")}
        />

        <Button
          fluid
          mt="16px"
          label="Continue"
          onClick={onContinue}
          disabled={!trust || trust?.raw.lte(0)}
        />
      </SteppedSection.Body>
    </SteppedSection>
  );
}

export default function VouchModal({
  title = "New Vouch",
  subTitle = "",
  onClose,
  address: initialAddress = null,
}) {
  const { isV2 } = useVersion();
  const { close } = useModals();

  const { refetch: refetchMember } = useMember();
  const { refetch: refetchVouchers } = useVouchers();
  const { refetch: refetchVouchees } = useVouchees();

  const { values, errors = {}, register } = useForm();
  const { setLabel } = useLabels();

  const [address, setAddress] = useState(initialAddress);
  const [activeSection, setActiveSection] = useState(0);
  const [skipVouchNote, setSkipVouchNote] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const onSendVouchComplete = async () => {
    await refetchMember();
    await refetchVouchees();
    await refetchVouchers();
    if (values.name) {
      setLabel(address, values.name);
    }

    await refetchMember();
  };

  const sendVouchButtonProps = useWrite({
    contract: "userManager",
    method: "updateTrust",
    args: [address, values?.trust?.raw],
    enabled: termsAccepted && values?.trust?.raw.gt(0) && address,
    onComplete: onSendVouchComplete,
  });

  const handleClose = () => {
    onClose?.();
    close();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <Modal className="VouchModal">
        <Modal.Header onClose={handleClose} title={title} subTitle={subTitle} />
        <Modal.Body p={0}>
          <SteppedSections>
            <VoucheeSection
              complete={!!address}
              address={address}
              setAddress={setAddress}
              register={register}
              errors={errors}
              active={activeSection === 0}
              onEdit={() => setActiveSection(0)}
              onContinue={() => setActiveSection(1)}
            />

            <TrustAmountSection
              trust={values?.trust}
              complete={values?.trust?.raw.gt(0)}
              register={register}
              errors={errors}
              active={activeSection === 1}
              onEdit={() => setActiveSection(1)}
              onContinue={() => setActiveSection(2)}
            />

            <SteppedSection active={activeSection === 2}>
              <SteppedSection.CollapsedHeader>
                <Text m={0} grey={400} size="medium">
                  Review & send
                </Text>
              </SteppedSection.CollapsedHeader>

              <SteppedSection.Header>
                <Box align="center" justify="space-between" fluid>
                  <Text m={0} grey={800} size="medium">
                    {skipVouchNote || !isV2 ? "Confirm vouch" : "Confirm & send vouch note"}
                  </Text>

                  {isV2 && (
                    <Toggle
                      active={skipVouchNote}
                      label="Skip vouch note"
                      labelPosition="start"
                      onChange={() => setSkipVouchNote((a) => !a)}
                    />
                  )}
                </Box>
              </SteppedSection.Header>

              <SteppedSection.Body direction="vertical">
                {isV2 && (
                  <TextArea
                    rows={4}
                    maxh="200px"
                    label="Write your vouch note"
                    rightLabel={`${values?.message?.length || 0}/140 characters`}
                    onChange={register("message")}
                    disabled={skipVouchNote}
                    placeholder={`Hey, I just vouched ${
                      values?.trust && values?.trust.formatted + " DAI"
                    } for you on Union. You now have an on-chain credit line! Come join me 🙂`}
                    inputProps={{
                      maxlength: 140,
                    }}
                  />
                )}

                <ControlRows
                  fluid
                  mt="12px"
                  items={[
                    {
                      type: "checkbox",
                      content: "I understand the risks of vouching on Union",
                      checked: termsAccepted,
                      onClick: () => setTermsAccepted((a) => !a),
                      tooltip: {
                        content:
                          "If an account you vouch for doesn't pay the minimum due within 30 days, they'll be in a defaulted state. If they stay that way for 60 days, your stake could be lost permanently to cover their debt.",
                        position: "left",
                      },
                    },
                  ]}
                />

                <Box fluid>
                  {skipVouchNote || !isV2 ? (
                    <Button
                      fluid
                      mt="16px"
                      size="large"
                      label="Confirm vouch"
                      icon={VouchIcon}
                      {...sendVouchButtonProps}
                      disabled={!termsAccepted}
                    />
                  ) : (
                    <SendVouchNoteButton
                      mt="16px"
                      address={address}
                      trust={values?.trust}
                      message={values?.message}
                      disabled={!termsAccepted}
                      onVouchComplete={onSendVouchComplete}
                      onVouchNoteComplete={close}
                    />
                  )}
                </Box>
              </SteppedSection.Body>
            </SteppedSection>
          </SteppedSections>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
