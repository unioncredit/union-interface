import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  SegmentedControl,
} from "@unioncredit/ui";
import { useState } from "react";
import { useAccount } from "wagmi";

import useWrite from "hooks/useWrite";
import { useMember } from "providers/MemberData";
import { compareAddresses } from "utils/compare";
import { Errors, ZERO_ADDRESS } from "constants";
import { useModals } from "providers/ModalManager";
import { AddressInput, AddressLabelBox } from "components/shared";

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
        <Modal.Header title="Delegate voting power" onClose={close} />
        <Modal.Body>
          <SegmentedControl
            mb="24px"
            items={options}
            onChange={({ id }) => setSelected(id)}
          />

          {selected === "delegate" && (
            <AddressInput
              mb="16px"
              name="address"
              label="Wallet address"
              placeholder="Ethereum address"
              disabled={selected !== "delegate"}
              error={error}
              onChange={setDelegate}
            />
          )}

          {currentDelegate !== ZERO_ADDRESS && (
            <AddressLabelBox
              mb="8px"
              label={
                currentDelegate === address
                  ? "Delegating votes to yourself"
                  : "Delegating votes to"
              }
              address={currentDelegate}
            />
          )}

          <Text mb="24px" grey={700}>
            When you delegate votes to{" "}
            {selected === "self" ? "yourself" : "a 3rd party"}, the voting power
            from your wallet balance and tokens delegated to you will be
            controlled by {selected === "self" ? "you" : "the 3rd party"} for
            use in voting on Union Improvement Proposals (UIP’s)
          </Text>

          <Button mt="8px" fluid label="Delegate votes" {...buttonProps} />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
