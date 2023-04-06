import "./StakeStep.scss";

import {
  Card,
  Box,
  Text,
  ButtonRow,
  Button,
  ProgressBar,
  NumericalBlock,
  Heading,
  WarningIcon,
  DepositIcon,
  WithdrawIcon,
  CheckIcon,
  PlayIcon,
  PauseIcon,
} from "@unioncredit/ui";
import { useNetwork } from "wagmi";

import { WAD } from "constants";
import format from "utils/format";
import { StakeType } from "constants";
import { useMember } from "providers/MemberData";
import { STAKE_MODAL } from "components/modals/StakeModal";
import { useModals } from "providers/ModalManager";
import { useProtocol } from "providers/ProtocolData";
import { ZERO } from "constants";
import { BlocksPerYear } from "constants";

export default function StakeStep() {
  const { open } = useModals();
  const { chain } = useNetwork();
  const { data: member = {} } = useMember();
  const { data: protocol } = useProtocol();

  const {
    unionBalance = ZERO,
    stakedBalance = ZERO,
    totalStaked = ZERO,
    totalFrozen = ZERO,
    inflationPerBlock = ZERO,
    unclaimedRewards = ZERO,
  } = { ...protocol, ...member };

  const percentage = unionBalance.gte(WAD)
    ? 100
    : Number(unionBalance.div(WAD));

  const unionEarned = unionBalance.add(unclaimedRewards);
  const effectiveTotalStake = totalStaked.sub(totalFrozen);

  const dailyEarnings = effectiveTotalStake.gt(ZERO)
    ? inflationPerBlock
        .mul(WAD)
        .div(effectiveTotalStake)
        .mul(stakedBalance)
        .div(WAD)
        .mul(BlocksPerYear[chain.id])
        .div(365)
    : ZERO;

  const progressBarProps = () => {
    if (unionEarned.gte(WAD)) {
      return {
        icon: CheckIcon,
        label: "Membership fee earned",
      };
    }

    if (unionEarned.gt(ZERO)) {
      if (stakedBalance.gt(ZERO)) {
        return {
          icon: PlayIcon,
          label: `${percentage}% Earned`,
        };
      }

      return {
        icon: PauseIcon,
        label: `Paused · ${percentage}%`,
        paused: true,
      };
    }

    return {
      icon: WarningIcon,
      label: "Deposit DAI to start earning",
    };
  };

  return (
    <Card size="fluid" mb="24px">
      <Card.Body>
        <Heading level={2} size="large" grey={700}>
          Stake DAI to earn UNION
        </Heading>
        <Text grey={500} size="medium">
          A minimum of 1 UNION is needed to complete the membership process and
          become a protocol member. You can use your DAI later to underwrite
          loans to trusted contacts.
        </Text>

        <Box
          fluid
          mt="16px"
          direction="vertical"
          className="StakeStep__container"
        >
          <Box justify="space-between" fluid>
            <NumericalBlock
              align="left"
              token="dai"
              size="regular"
              title="Total Staked"
              value={format(stakedBalance)}
            />
            <NumericalBlock
              align="left"
              token="union"
              size="regular"
              title="Est. daily earnings"
              value={format(dailyEarnings)}
            />
            <NumericalBlock
              align="left"
              token="union"
              size="regular"
              title="UNION Earned"
              value={format(unionEarned, 4)}
            />
          </Box>

          <ProgressBar
            m="16px 0"
            percentage={percentage}
            {...progressBarProps()}
          />

          <ButtonRow w="100%">
            <Button
              fluid
              size="large"
              label="Deposit"
              icon={DepositIcon}
              onClick={() => open(STAKE_MODAL, { type: StakeType.STAKE })}
            />
            <Button
              fluid
              color="secondary"
              variant="light"
              label="Withdraw"
              size="large"
              icon={WithdrawIcon}
              onClick={() => open(STAKE_MODAL, { type: StakeType.UNSTAKE })}
            />
          </ButtonRow>
        </Box>
      </Card.Body>
    </Card>
  );
}
