import "./StakeModal.scss";

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
import { Errors } from "constants";
import useForm from "hooks/useForm";
import { min } from "utils/numbers";
import { StakeType } from "constants";
import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import Approval from "components/shared/Approval";
import { useModals } from "providers/ModalManager";
import { useProtocol } from "providers/ProtocolData";
import { ZERO } from "constants";

export const STAKE_MODAL = "stake-modal";

const toggleMenuOptions = [
  { id: StakeType.STAKE, label: "Stake" },
  { id: StakeType.UNSTAKE, label: "Unstake" },
];

export default function StakeModal({ type: initialType = StakeType.STAKE }) {
  const { close } = useModals();
  const { address } = useAccount();
  const { data: member } = useMember();
  const { data: protocol } = useProtocol();
  const [type, setType] = useState(initialType);

  const userManagerContract = useContract("userManager");

  const initialActiveIndex = toggleMenuOptions.findIndex(
    ({ id }) => id === type
  );

  const userStakeLimit = protocol.maxStakeAmount.sub(member.stakedBalance);
  const maxUserStake = min(userStakeLimit, member.daiBalance);
  const maxUserUnstake = member.stakedBalance.sub(member.totalLockedStake);

  const validate = (inputs) => {
    if (inputs.amount.raw.gt(maxUserStake)) {
      return Errors.MAX_USER_STAKE;
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

  const inputProps =
    type === StakeType.STAKE
      ? {
          label: "Amount to stake",
          caption: `Balance: ${format(member.daiBalance)} DAI`,
          onCaptionButtonClick: () => setRawValue("amount", maxUserStake),
        }
      : {
          label: "Amount to unstake",
          caption: `Withdrawable: ${format(maxUserUnstake)} DAI`,
          onCaptionButtonClick: () => setRawValue("amount", maxUserUnstake),
        };

  return (
    <ModalOverlay onClick={close}>
      <Modal
        onClose={close}
        className="StakeModal"
        title="Stake or unstake DAI"
      >
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
            onChange={register("amount")}
            {...inputProps}
          />
        </Box>

        <Box justify="space-between" mt="16px" mb="4px">
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
        {type === StakeType.STAKE ? (
          <Box justify="space-between" mb="18px">
            <Label as="p" grey={400}>
              Staking Limit
            </Label>
            <Label as="p" grey={700}>
              {format(protocol.maxStakeAmount)}
            </Label>
          </Box>
        ) : (
          <Box justify="space-between" mb="18px">
            <Label as="p" grey={400}>
              Available to Unstake
            </Label>
            <Label as="p" grey={700}>
              {format(maxUserUnstake)}
            </Label>
          </Box>
        )}

        <Approval
          owner={address}
          amount={amount.raw}
          spender={userManagerContract.addressOrName}
          requireApproval={type === StakeType.STAKE}
          tokenContract="dai"
          actionProps={{
            args: [amount.raw],
            enabled: !isErrored,
            contract: "userManager",
            method: type === StakeType.STAKE ? "stake" : "unstake",
            label: `${type === StakeType.STAKE ? "Stake" : "Unstake"} ${
              amount.display
            } DAI`,
          }}
          approvalLabel="Approve Union to spend your DAI"
          approvalCompleteLabel="You can now stake your DAI"
        />
      </Modal>
    </ModalOverlay>
  );
}
