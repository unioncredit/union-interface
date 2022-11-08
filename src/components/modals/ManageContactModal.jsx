import {
  Box,
  Button,
  Dai,
  Label,
  Modal,
  ModalOverlay,
  Text,
} from "@unioncredit/ui";
import { useAccount } from "wagmi";

import { ZERO } from "constants";
import format from "utils/format";
import { useModals } from "providers/ModalManager";
import AddressSummary from "components/shared/AddressSummary";
import EditLabel from "components/shared/EditLabel";
import { ContactsType } from "constants";
import useWrite from "hooks/useWrite";
import { useMember } from "providers/MemberData";
import { EDIT_VOUCH_MODAL } from "./EditVouch";
import { WRITE_OFF_DEBT_MODAL } from "./WriteOffDebtModal";

export const MANAGE_CONTACT_MODAL = "manager-contact-modal";

export default function ManageContactModal({ contact, type }) {
  const { close, open } = useModals();
  const { refetch: refetchMember } = useMember();
  const { address: connectedAddress } = useAccount();

  const { address, locking = ZERO, trust = ZERO } = contact;

  const options =
    type === ContactsType.VOUCHEES
      ? [
          {
            label: "Trust",
            onClick: () => open(EDIT_VOUCH_MODAL, { address }),
            buttonProps: { label: "Change amount" },
            value: <Dai value={format(trust)} />,
          },
          {
            label: "Outstanding debt",
            onClick: () => open(WRITE_OFF_DEBT_MODAL, { address }),
            value: <Dai value={format(locking)} />,
            buttonProps: {
              label: "Write-off debt",
              disabled: locking.lte(ZERO),
            },
          },
        ]
      : [];

  const cancelVouchButtonProps = useWrite({
    contract: "userManager",
    method: "cancelVouch",
    args:
      type === ContactsType.VOUCHEES
        ? [connectedAddress, address]
        : [address, connectedAddress],
    enabled: locking.lte(ZERO),
    onComplete: () => refetchMember(),
  });

  return (
    <ModalOverlay onClick={close}>
      <Modal className="ManagerContactModal">
        <Modal.Header title="Manage Contact" onClose={close} />
        <Modal.Body>
          <AddressSummary address={address} />
          {/*----------------------------------------------------
            * Edit Label 
          -------------------------------------------------------*/}
          <EditLabel address={address} />
          {/*----------------------------------------------------
            * Options 
          -------------------------------------------------------*/}
          {options.map(({ label, value, onClick, buttonProps }) => (
            <Box
              fluid
              mb="12px"
              key={label}
              align="center"
              justify="space-between"
            >
              <Box direction="vertical">
                <Label size="small" grey={400} as="p" m={0}>
                  {label.toUpperCase()}
                </Label>
                <Text size="large" mb={0} grey={800}>
                  {value}
                </Text>
              </Box>
              <Box>
                <Button
                  ml="auto"
                  variant="pill"
                  {...buttonProps}
                  onClick={onClick}
                />
              </Box>
            </Box>
          ))}
          {/*----------------------------------------------------
            * Buttons 
          -------------------------------------------------------*/}
          <Label as="p" align="center" mt="24px" grey={400} size="small">
            Contacts with outstanding balance can’t be removed
          </Label>
          <Button
            fluid
            mt="16px"
            color="red"
            fontSize="large"
            variant="secondary"
            label="Remove from contacts"
            disabled={locking.gt(ZERO)}
            {...cancelVouchButtonProps}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
