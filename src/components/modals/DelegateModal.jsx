import {
  Text,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ToggleMenu,
} from "@unioncredit/ui";
import { useState } from "react";
import { useAccount } from "wagmi";

import useWrite from "hooks/useWrite";
import { useMember } from "providers/MemberData";
import { compareAddresses } from "utils/compare";
import { Errors, ZERO_ADDRESS } from "constants";
import { useModals } from "providers/ModalManager";
import AddressInput from "components/shared/AddressInput";

export const DELEGATE_MODAL = "delegate-modal";

const options = [
  { label: "To self", id: "self" },
  { label: "Third party", id: "delegate" },
];

export default function DelegateModal() {
  const { close } = useModals();
  const { address } = useAccount();
  const { data: member, refetch: refetchMember } = useMember();

  const [selected, setSelected] = useState("self");
  const [delegate, setDelegate] = useState(null);

  const { delegate: currentDelegate = ZERO_ADDRESS } = member;

  const delegateTo = selected === "self" ? address : delegate;

  const buttonProps = useWrite({
    contract: "union",
    method: "delegate",
    args: [delegateTo],
    enabled: !(
      delegateTo &&
      currentDelegate &&
      compareAddresses(delegateTo, currentDelegate)
    ),
    onComplete: () => refetchMember(),
  });

  const error =
    delegateTo &&
    currentDelegate &&
    compareAddresses(delegateTo, currentDelegate) &&
    Errors.ALREADY_DELEGATING;

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="DelegateModal">
        <Modal.Header title="Delegate votes" onClose={close} />
        <Modal.Body>
          <Text mb="16px">
            Vote as yourself or choose a trustworthy third party whom you’d like
            to vote on your behalf.
          </Text>
          <ToggleMenu
            fluid
            items={options}
            onChange={({ id }) => setSelected(id)}
          />
          <Box mt="18px" fluid />
          <AddressInput
            name="address"
            label="Wallet address"
            placeholder="Ethereum address"
            disabled={selected !== "delegate"}
            error={error}
            onChange={setDelegate}
          />
          <Button
            mt="8px"
            fluid
            label={
              selected === "delegate"
                ? "Delegate to third party"
                : "Vote as self"
            }
            {...buttonProps}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
