import {
  Dai,
  Input,
  Modal,
  ModalOverlay,
  ToggleMenu,
  Box,
  Label,
} from "@unioncredit/ui";
import { useState } from "react";
import { useAccount } from "wagmi";

import format from "utils/format";
import useForm from "hooks/useForm";
import { StakeType } from "constants";
import { useModals } from "providers/ModalManager";
import { useMember } from "providers/MemberData";
import Approval from "components/shared/Approval";
import useContract from "hooks/useContract";

export const STAKE_MODAL = "stake-modal";

const toggleMenuOptions = [
  { id: StakeType.STAKE, label: "Stake" },
  { id: StakeType.UNSTAKE, label: "Unstake" },
];

export default function StakeModal() {
  const { close } = useModals();
  const { address } = useAccount();
  const { data: member } = useMember();
  const [type, setType] = useState(StakeType.STAKE);

  const userManagerContract = useContract("userManager");

  const initialActiveIndex = toggleMenuOptions.findIndex(
    ({ id }) => id === type
  );

  const maxUserStake = member.daiBalance;

  const validate = (inputs) => {
    if (inputs.amount.raw.gt(maxUserStake)) {
      // TODO: add to constants file
      return "Max stake exceeded";
    }
  };

  const {
    register,
    values = {},
    errors = {},
    empty,
    setRawValue,
    isErrored,
  } = useForm({ validate });

  const amount = values.amount || empty;

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

        <Approval
          owner={address}
          amount={amount.raw}
          spender={userManagerContract.addressOrName}
          tokenContract="dai"
          actionProps={{
            label: `Stake ${amount.display} DAI`,
            contract: "userManager",
            method: "stake",
            args: [amount.raw],
            enabled: !isErrored,
          }}
          approvalLabel="Approve Union to spend your DAI"
          approvalCompleteLabel="You can now stake your DAI"
        />
      </Modal>
    </ModalOverlay>
  );
}
