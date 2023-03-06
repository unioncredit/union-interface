import "./StakeStep.scss";

import {
  Card,
  Divider,
  Stat,
  Dai,
  Box,
  Text,
  ButtonRow,
  Button,
  Union,
  ProgressBar,
  NumericalBlock,
} from "@unioncredit/ui";
import { useNetwork } from "wagmi";
import { ReactComponent as Check } from "@unioncredit/ui/lib/icons/wireCheck.svg";

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
    newMemberFee = ZERO,
    inflationPerBlock = ZERO,
    unclaimedRewards = ZERO,
  } = { ...protocol, ...member };

  const percentage = unionBalance.gte(WAD)
    ? 100
    : Number(unionBalance.div(WAD));

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

  return (
    <Card size="fluid" mb="24px">
      <Card.Header
        title="Stake DAI to earn UNION"
        subTitle="Your staked DAI is used to back vouches you provide to other members. It also accrues UNION at a rate relative to the amount of DAI you have staked."
      />
      <Card.Body>
        <Divider />
        <Box fluid mt="24px" mb="14px">
          <Box fluid>
            <NumericalBlock
              label="Total Staked"
              value={<Dai value={format(stakedBalance)} />}
            />
          </Box>
          <Box fluid>
            <NumericalBlock
              title="UNION Earned"
              value={
                <Union value={format(unionBalance.add(unclaimedRewards), 3)} />
              }
            />
          </Box>
        </Box>
        <ProgressBar
          percentage={percentage}
          completeText="Membership Fee Earned"
          completeIcon={Check}
        />
        <Box
          className="StakeStep__Box__details"
          justify="space-between"
          pb="8px"
          mb="8px"
          mt="16px"
        >
          <Text m={0}>Membership Fee</Text>
          <Text m={0}>{format(newMemberFee)} UNION</Text>
        </Box>
        <Box
          className="StakeStep__Box__details"
          justify="space-between"
          pb="8px"
          mb="12px"
        >
          <Text m={0}>Estimated daily earnings</Text>
          <Text m={0}>{format(dailyEarnings)} UNION</Text>
        </Box>

        <ButtonRow>
          <Button
            fluid
            label="Stake DAI"
            onClick={() => open(STAKE_MODAL, { type: StakeType.STAKE })}
          />
          <Button
            fluid
            variant="secondary"
            label="Withdraw"
            onClick={() => open(STAKE_MODAL, { type: StakeType.UNSTAKE })}
          />
        </ButtonRow>
      </Card.Body>
    </Card>
  );
}
