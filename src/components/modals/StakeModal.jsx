import {
  Dai,
  Usdc,
  Input,
  Modal,
  ModalOverlay,
  Box,
  SegmentedControl,
  NumericalRows,
} from "@unioncredit/ui";
import { useState } from "react";
import { useAccount } from "wagmi";

import format from "utils/format";
import { Errors, WAD } from "constants";
import useForm from "hooks/useForm";
import { min } from "utils/numbers";
import { StakeType } from "constants";
import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import { Approval } from "components/shared";
import { useModals } from "providers/ModalManager";
import { useProtocol } from "providers/ProtocolData";
import { useSettings } from "providers/Settings";
import { ZERO } from "constants";
import Token from "components/Token";

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
  const {
    settings: { useToken },
  } = useSettings();

  const userManagerContract = useContract("userManager");

  const initialActiveIndex = toggleMenuOptions.findIndex(({ id }) => id === initialType);

  const {
    stakedBalance = ZERO,
    totalLockedStake = ZERO,
    tokenBalance = ZERO,
    maxStakeAmount = ZERO,
  } = { ...member, ...protocol };

  let userStakeLimit = maxStakeAmount.sub(stakedBalance);
  userStakeLimit = userStakeLimit.lte(0) ? ZERO : userStakeLimit;

  const maxUserStake = min(userStakeLimit, tokenBalance);
  const maxUserUnstake = stakedBalance.sub(totalLockedStake);

  const validateStake = (inputs) => {
    if (inputs.amount.display !== "" && inputs.amount.raw.lt(WAD)) {
      return Errors.MIN_STAKE_LIMIT_REQUIRED;
    }
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
    setRawValue,
    reset,
    isErrored,
  } = useForm({
    validate: type === StakeType.STAKE ? validateStake : validateUnstake,
  });

  const amount = values.amount || empty;

  const inputProps =
    type === StakeType.STAKE
      ? {
          label: "Amount to stake",
          rightLabel: `Max. ${format(maxUserStake)} ${useToken}`,
          rightLabelAction: () => setRawValue("amount", maxUserStake, false),
        }
      : {
          label: "Amount to unstake",
          rightLabel: `Max. ${format(maxUserUnstake)} ${useToken}`,
          rightLabelAction: () => setRawValue("amount", maxUserUnstake, false),
        };

  return (
    <ModalOverlay onClick={close}>
      <Modal className="StakeModal">
        <Modal.Header onClose={close} title={`Stake or unstake ${useToken}`} />
        <Modal.Body>
          <SegmentedControl
            items={toggleMenuOptions}
            initialActive={initialActiveIndex}
            onChange={(item) => {
              setType(item.id);
              reset();
            }}
          />

          <Box mt="24px">
            <Input
              type="number"
              placeholder="0"
              suffix={<Token />}
              error={errors.amount}
              value={amount.formatted}
              onChange={register("amount")}
              {...inputProps}
            />
          </Box>

          <NumericalRows
            m="24px 0"
            items={[
              {
                label: "Currently staked",
                value: `${format(stakedBalance)} ${useToken}`,
                tooltip: {
                  content: `Amount of ${useToken} you have staked in the protocol`,
                },
              },
              {
                label: "Your locked stake",
                value: `${format(totalLockedStake)} ${useToken}`,
                tooltip: {
                  content: `This is ${useToken} you cant withdraw because it is currently underwriting a Borrow you vouched for`,
                },
              },
              type === StakeType.STAKE
                ? {
                    label: "Available to stake",
                    value: `${format(maxUserStake)} ${useToken}`,
                    error: errors.amount === Errors.MAX_USER_BALANCE_EXCEEDED,
                  }
                : {
                    label: "Available to unstake",
                    value: `${format(maxUserUnstake)} ${useToken}`,
                    error: errors.amount === Errors.MAX_USER_BALANCE_EXCEEDED,
                  },
              type === StakeType.STAKE && {
                label: "Staking limit",
                value: `${format(maxStakeAmount)} ${useToken}`,
                error: errors.amount === Errors.MAX_STAKE_LIMIT_EXCEEDED,
                tooltip: {
                  content: "A contract defined maximum any one account can stake in the protocol",
                },
              },
            ]}
          />

          <Approval
            owner={address}
            amount={amount.raw}
            spender={userManagerContract.address}
            requireApproval={type === StakeType.STAKE}
            tokenContract={useToken.toLowerCase()}
            actionProps={{
              args: [amount.raw],
              permitArgs: [amount.raw],
              enabled: !isErrored,
              contract: "userManager",
              method: type === StakeType.STAKE ? "stake" : "unstake",
              label: `${type === StakeType.STAKE ? "Stake" : "Unstake"} ${
                amount.display
              } ${useToken}`,
            }}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
