import {
  Dai,
  Input,
  Modal,
  ModalOverlay,
  ToggleMenu,
  Box,
  Label,
  Button,
} from "@unioncredit/ui";
import { useState } from "react";
import useForm from "hooks/useForm";

import format from "utils/format";
import { StakeType } from "constants";
import { useModals } from "providers/ModalManager";
import useWrite from "hooks/useWrite";

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
  const maxUserStakeDisplay = format(maxUserStake);

  const validate = () => {};

  const { register, values = {}, errors = {}, zero } = useForm({ validate });

  const amount = values.amount || zero;

  const txButtonProps = useWrite({
    contract: "userManager",
    method: "stake",
    args: [amount.raw],
  });

  return (
    <ModalOverlay onClick={close}>
      <Modal title="Stake or unstake DIA" onClose={close}>
        <ToggleMenu
          fluid
          packed
          items={toggleMenuOptions}
          initialActive={initialActiveIndex}
          onChange={(item) => setType(item.id)}
        />

        <Input
          type="number"
          label="Amount to stake"
          caption={`Max. ${maxUserStakeDisplay} DAI`}
          onChange={register("amount")}
          error={errors.amount}
          onCaptionClick={() => setRawValue(maxUserStake)}
          placeholder="0"
          suffix={<Dai />}
        />

        <Box justify="space-between" mt="8px" mb="4px">
          <Label as="p" grey={400}>
            Currently Staked
          </Label>
          <Label as="p" grey={700} m={0}>
            00
          </Label>
        </Box>
        <Box justify="space-between" mb="4px">
          <Label as="p" grey={400}>
            Utilized Stake
          </Label>
          <Label as="p" grey={700} m={0}>
            00
          </Label>
        </Box>
        <Box justify="space-between" mb="18px">
          <Label as="p" grey={400}>
            Staking Limit
          </Label>
          <Label as="p" grey={700}>
            00
          </Label>
        </Box>

        <Button
          fluid
          label={`Stake ${amount.display} DAI`}
          {...txButtonProps}
        />
      </Modal>
    </ModalOverlay>
  );
}
