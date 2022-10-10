import { Dai, Input, Modal, ModalOverlay, ToggleMenu } from "@unioncredit/ui";

import { StakeType } from "constants";
import { useModals } from "providers/ModalManager";
import { useState } from "react";

export const STAKE_MODAL = "stake-modal";

const toggleMenuOptions = [
  { id: StakeType.STAKE, label: "Stake" },
  { id: StakeType.UNSTAKE, label: "Unstake" },
];

export default function StakeModal() {
  const { close } = useModals();
  const [type, setType] = useState(StakeType.STAKE);

  const initialActiveIndex = toggleMenuOptions.findIndex(
    ({ id }) => id === type
  );

  const maxUserStake = 0;

  return (
    <ModalOverlay onClick={close}>
      <Modal title="Stake or unstake DIA" onClose={close}>
        <ToggleMenu
          fluid
          packed
          onChange={(item) => setType(item.id)}
          items={toggleMenuOptions}
          initialActive={initialActiveIndex}
        />
        <Input
          type="number"
          label="Amount to stake"
          caption={`Max. ${maxUserStake} DAI`}
          onCaptionClick={() => alert()}
          placeholder="0"
          suffix={<Dai />}
        />
      </Modal>
    </ModalOverlay>
  );
}
