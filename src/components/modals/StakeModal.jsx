import "./StakeModal.scss";

import {
  Dai,
  Input,
  Modal,
  ModalOverlay,
  Box,
  Text,
  SegmentedControl,
  NumericalLines,
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

  const {
    stakedBalance = ZERO,
    totalLockedStake = ZERO,
    daiBalance = ZERO,
    maxStakeAmount = ZERO,
  } = { ...member, ...protocol };

  const userStakeLimit = maxStakeAmount.sub(stakedBalance);
  const maxUserStake = min(userStakeLimit, daiBalance);
  const maxUserUnstake = stakedBalance.sub(totalLockedStake);

  const validateStake = (inputs) => {
    if (inputs.amount.raw.gt(userStakeLimit)) {
      return Errors.MAX_STAKE_LIMIT_EXCEEDED;
    }
    if (inputs.amount.raw.gt(maxUserStake)) {
      return Errors.MAX_USER_BALANCE_EXCEEDED;
    }
  };

  const validateUnstake = (inputs) => {
    if (inputs.amount.raw.gt(maxUserUnstake)) {
      return Errors.MAX_USER_BALANCE_EXCEEDED;
    }
  };

  const {
    register,
    values = {},
    errors = {},
    empty,
    isErrored,
  } = useForm({
    validate: type === StakeType.STAKE ? validateStake : validateUnstake,
  });

  const amount = values.amount || empty;

  const inputProps =
    type === StakeType.STAKE
      ? {
          label: "Amount to stake",
          rightLabel: `Max. ${format(daiBalance)} DAI`,
        }
      : {
          label: "Amount to unstake",
        };

  return (
    <ModalOverlay onClick={close}>
      <Modal className="StakeModal">
        <Modal.Header onClose={close} title="Stake or unstake DAI" />
        <Modal.Body>
          <SegmentedControl
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

          <NumericalLines
            m="24px 0"
            items={[
              {
                label: "Currently staked",
                value: `${format(stakedBalance)} DAI`,
                tooltip: {
                  shrink: true,
                  content: "TODO",
                  position: "right",
                },
              },
              {
                label: "Your locked stake",
                value: `${format(totalLockedStake)} DAI`,
                tooltip: {
                  shrink: true,
                  content: "TODO",
                  position: "right",
                },
              },
              type === StakeType.STAKE
                ? {
                    label: "Available to stake",
                    value: `${format(daiBalance)} DAI`,
                    error: errors.amount === Errors.MAX_USER_BALANCE_EXCEEDED,
                    tooltip: {
                      shrink: true,
                      content: "TODO",
                      position: "right",
                    },
                  }
                : {
                    label: "Available to unstake",
                    value: `${format(maxUserUnstake)} DAI`,
                    error: errors.amount === Errors.MAX_USER_BALANCE_EXCEEDED,
                    tooltip: {
                      shrink: true,
                      content: "TODO",
                      position: "right",
                    },
                  },
              type === StakeType.STAKE && {
                label: "Staking limit",
                value: `${format(maxStakeAmount)} DAI`,
                error: errors.amount === Errors.MAX_STAKE_LIMIT_EXCEEDED,
                tooltip: {
                  shrink: true,
                  content: "TODO",
                  position: "right",
                },
              },
            ]}
          />

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
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
