import "./StakeStep.scss";

import {
  ArrowIcon,
  Box,
  Button,
  ButtonRow,
  Card,
  CheckIcon,
  DepositIcon,
  Heading,
  NumericalBlock,
  PauseIcon,
  PlayIcon,
  ProgressBar,
  Text,
  WarningIcon,
} from "@unioncredit/ui";
import { useAccount } from "wagmi";
import { useCallback } from "react";

import { PaymentUnitsPerYear, StakeType, WAD, ZERO } from "constants";
import format from "utils/format";
import { useMember } from "providers/MemberData";
import { STAKE_MODAL } from "components/modals/StakeModal";
import { useModals } from "providers/ModalManager";
import { useProtocol } from "providers/ProtocolData";
import { useToken } from "hooks/useToken";

export default function StakeStep({ complete, onSkipStep }) {
  const { open } = useModals();
  const { chain } = useAccount();
  const { token, wad } = useToken();

  const { data: member, refetch: refetchMember } = useMember();
  const { data: protocol } = useProtocol();

  const {
    unionBalance = ZERO,
    stakedBalance = ZERO,
    totalStaked = ZERO,
    totalFrozen = ZERO,
    inflationPerSecond = ZERO,
    inflationPerBlock = ZERO,
    unclaimedRewards = ZERO,
    newMemberFee = ZERO,
  } = { ...protocol, ...member };

  const inflationPerUnit = inflationPerSecond || inflationPerBlock;

  const virtualBalance = unionBalance + unclaimedRewards;
  const percentage =
    virtualBalance >= WAD["UNION"] ? 100 : Number((virtualBalance * 10000n) / WAD["UNION"]) / 100;

  const unionEarned = unionBalance + unclaimedRewards;
  const effectiveTotalStake = totalStaked - totalFrozen;

  const dailyEarnings =
    effectiveTotalStake > ZERO
      ? (((((inflationPerUnit * wad) / effectiveTotalStake) * stakedBalance) / wad) *
          PaymentUnitsPerYear[chain.id]) /
        365n
      : ZERO;

  const progressBarProps = useCallback(() => {
    if (unionEarned >= WAD["UNION"]) {
      return {
        icon: CheckIcon,
        label: "Membership fee earned",
      };
    }

    if (unionEarned > ZERO) {
      if (stakedBalance > ZERO) {
        return {
          icon: PlayIcon,
          forceActive: true,
          label: `${percentage || "<0.01"}% Earned`,
        };
      }

      return {
        icon: PauseIcon,
        label: `Paused · ${percentage || "<0.01"}%`,
        paused: true,
      };
    }

    return {
      icon: WarningIcon,
      label: `Deposit ${token} to start earning`,
    };
  }, [unionEarned, stakedBalance, percentage]);

  return (
    <Card size="fluid" mb="24px">
      <Card.Body>
        <Heading level={2} size="large" grey={700}>
          Deposit {token} to begin
        </Heading>
        <Text grey={500} size="medium">
          Staked funds are used to back credit you give to others. Skip if just borrowing.
        </Text>

        <Box fluid mt="16px" direction="vertical" className="StakeStep__container">
          <Box className="StakeStep__stats" justify="space-between" fluid>
            <NumericalBlock
              fluid
              align="left"
              token={token.toLowerCase()}
              size="regular"
              title="Total Staked"
              value={format(stakedBalance, token)}
            />
            <NumericalBlock
              fluid
              align="left"
              token="union"
              size="regular"
              title="Est. daily earnings"
              value={format(dailyEarnings, "UNION")}
            />
            <NumericalBlock
              fluid
              align="left"
              token="union"
              size="regular"
              title="UNION Earned"
              value={format(unionEarned, "UNION", 4)}
            />
          </Box>

          <Box fluid m="16px 0" className="StakeStep__progress-container">
            <ProgressBar fluid percentage={percentage} {...progressBarProps()} />
          </Box>

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
              label="Skip"
              size="large"
              icon={ArrowIcon}
              onClick={onSkipStep}
              disabled={complete}
            />
          </ButtonRow>
        </Box>
      </Card.Body>
    </Card>
  );
}
