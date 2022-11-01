import "./StakeStep.scss";

import {
  Card,
  Divider,
  Stat,
  Dai,
  Box,
  Label,
  ButtonRow,
  Button,
  Union,
  ProgressBar,
} from "@unioncredit/ui";
import { ReactComponent as Check } from "@unioncredit/ui/lib/icons/wireCheck.svg";

import { WAD } from "constants";
import format from "utils/format";
import { StakeType } from "constants";
import { useMember } from "providers/MemberData";
import { STAKE_MODAL } from "components/modals/StakeModal";
import { useModals } from "providers/ModalManager";
import { useProtocol } from "providers/ProtocolData";

export default function StakeStep() {
  const { data } = useMember();
  const { open } = useModals();
  const { data: protocol } = useProtocol();

  const percentage = data.unionBalance.gte(WAD)
    ? 100
    : Number(data.unionBalance.div(WAD));

  return (
    <Card size="fluid" mb="24px">
      <Card.Header
        title="Stake DAI to earn UNION"
        subTitle="Your staked DAI is used to back vouches you provide to other members. It also accrues UNION at a rate relative to the amount of DAI you have staked."
      />
      <Card.Body>
        <Divider />
        <ProgressBar
          percentage={percentage}
          completeText="Membership Fee Earned"
          completeIcon={Check}
        />
        <Box fluid mt="24px" mb="14px">
          <Box fluid>
            <Stat
              size="medium"
              label="Total Staked"
              value={<Dai value={format(data.stakedBalance)} />}
            />
          </Box>
          <Box fluid>
            <Stat
              size="medium"
              label="UNION Earned"
              value={<Union value={format(data.unionBalance, 3)} />}
            />
          </Box>
        </Box>

        <Box
          className="StakeStep__Box__details"
          justify="space-between"
          pb="8px"
          mb="8px"
        >
          <Label m={0}>Membership Fee</Label>
          <Label m={0}>{format(protocol.newMemberFee)} UNION</Label>
        </Box>
        <Box
          className="StakeStep__Box__details"
          justify="space-between"
          pb="8px"
          mb="12px"
        >
          <Label m={0}>Estimated daily earnings</Label>
          <Label m={0}>16.23 UNION</Label>
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
