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
import useWrite from "hooks/useWrite";
import { StakeType } from "constants";
import { useModals } from "providers/ModalManager";
import { useMember } from "providers/MemberData";

export const STAKE_MODAL = "stake-modal";

const toggleMenuOptions = [
  { id: StakeType.STAKE, label: "Stake" },
  { id: StakeType.UNSTAKE, label: "Unstake" },
];

export default function StakeModal() {
  const { close } = useModals();
  const { data: member } = useMember();
  const [type, setType] = useState(StakeType.STAKE);

  const initialActiveIndex = toggleMenuOptions.findIndex(
    ({ id }) => id === type
  );

  const maxUserStake = member.daiBalance;

  const validate = (inputs) => {
    if (inputs.amount.raw.gt(maxUserStake)) {
      return "Max stake exceeded";
    }
  };

  const {
    register,
    values = {},
    errors = {},
    isErrored,
    empty,
    setRawValue,
  } = useForm({ validate });

  const amount = values.amount || empty;

  const txButtonProps = useWrite({
    contract: "userManager",
    method: "stake",
    args: [amount.raw],
    enabled: amount.raw.gt(0) && !isErrored,
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

        <Box mt="24px">
          <Input
            type="number"
            placeholder="0"
            suffix={<Dai />}
            error={errors.amount}
            value={amount.display}
            label="Amount to stake"
            onChange={register("amount")}
            caption={`Balance: ${format(member.daiBalance)} DAI`}
            onCaptionButtonClick={() => setRawValue("amount", maxUserStake)}
          />
        </Box>

        <Box justify="space-between" mt="8px" mb="4px">
          <Label as="p" grey={400}>
            Currently Staked
          </Label>
          <Label as="p" grey={700} m={0}>
            {format(member.stakedBalance)}
          </Label>
        </Box>
        <Box justify="space-between" mb="4px">
          <Label as="p" grey={400}>
            Utilized Stake
          </Label>
          <Label as="p" grey={700} m={0}>
            {format(member.totalLockedStake)}
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
