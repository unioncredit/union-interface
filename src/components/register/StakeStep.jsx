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
  ClaimIcon,
} from "@unioncredit/ui";
import { useNetwork } from "wagmi";
import { useCallback } from "react";

import { WAD } from "constants";
import format from "utils/format";
import { StakeType } from "constants";
import { useMember } from "providers/MemberData";
import { STAKE_MODAL } from "components/modals/StakeModal";
import { useModals } from "providers/ModalManager";
import { useProtocol } from "providers/ProtocolData";
import { ZERO } from "constants";
import { BlocksPerYear } from "constants";
import useWrite from "hooks/useWrite";
import { useToken } from "hooks/useToken";

export default function StakeStep() {
  const { open } = useModals();
  const { chain } = useNetwork();
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

  const virtualBalance = unionBalance.add(unclaimedRewards);
  const percentage = virtualBalance.gte(WAD["UNION"])
    ? 100
    : Number(virtualBalance.mul(10000).div(WAD["UNION"])) / 100;

  const unionEarned = unionBalance.add(unclaimedRewards);
  const effectiveTotalStake = totalStaked.sub(totalFrozen);

  const dailyEarnings = effectiveTotalStake.gt(ZERO)
    ? inflationPerUnit
        .mul(wad)
        .div(effectiveTotalStake)
        .mul(stakedBalance)
        .div(wad)
        .mul(BlocksPerYear[chain.id])
        .div(365)
    : ZERO;

  const claimTokensButtonProps = useWrite({
    contract: "userManager",
    method: "withdrawRewards",
    onComplete: () => refetchMember(),
  });

  const progressBarProps = useCallback(() => {
    if (unionEarned.gte(WAD["UNION"])) {
      return {
        icon: CheckIcon,
        label: "Membership fee earned",
      };
    }

    if (unionEarned.gt(ZERO)) {
      if (stakedBalance.gt(ZERO)) {
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
          Stake {token} to provide credit to those you Trust
        </Heading>
        <Text grey={500} size="medium">
          After registration, you can use this staked {token} to extend credit trusted contacts, and
          continue to earn Union Tokens (UNION){" "}
          <a
            href="https://docs.union.finance/user-guides/becoming-a-member"
            target="_blank"
            rel="noopener noreferrer"
          >
            (Learn More)
          </a>
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
            {unionEarned.gte(newMemberFee) && (
              <Button
                ml="8px"
                icon={ClaimIcon}
                size="large"
                label="Claim Tokens"
                {...claimTokensButtonProps}
              />
            )}
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
