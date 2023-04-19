import "./Register.scss";

import {
  Card,
  Grid,
  Heading,
  ProgressList,
  ProgressListItem,
  Text,
  Box,
  UnionIcon,
} from "@unioncredit/ui";
import { Helmet } from "react-helmet";

import { ZERO } from "constants";
import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useVouchers } from "providers/VouchersData";
import { useProtocol } from "providers/ProtocolData";
import StakeStep from "components/register/StakeStep";
import VouchersStep from "components/register/VouchersStep";
import RegisterButton from "components/register/RegisterButton";
import { useModals } from "providers/ModalManager";
import { WELCOME_MODAL } from "components/modals/WelcomeModal";
import { useRef } from "react";

export default function RegisterPage() {
  const { open } = useModals();
  const { data: protocol = {} } = useProtocol();
  const { data: vouchersData = [] } = useVouchers();
  const { data: member = {} } = useMember();
  const vouchers = vouchersData.filter((voucher) =>
    voucher.stakerBalance?.gt(ZERO)
  );

  const stakeStep = useRef();
  const vouchStep = useRef();
  const memberStep = useRef();

  const {
    isMember = false,
    unionBalance = ZERO,
    unclaimedRewards = ZERO,
  } = member;

  const getNumberOfTasksCompleted = () => {
    let completed = 0;

    if (unionBalance?.add(unclaimedRewards).gt(0)) {
      completed++;
    }
    if (vouchers.length > 0) {
      completed++;
    }
    if (isMember) {
      completed++;
    }

    return completed;
  };

  const stakeComplete = unionBalance?.add(unclaimedRewards).gt(0);
  const vouchComplete = vouchers.length > 0;

  return (
    <>
      <Helmet>
        <title>Register | Union Credit Protocol</title>
      </Helmet>
      <Grid className="Register">
        <Grid.Row justify="center">
          <Grid.Col xs={11} md={8} className="Register__col">
            <Heading level={1} mb="0" className="Register__heading" grey={800}>
              Become a Union member
            </Heading>
            <Text m={0} grey={500} size="medium">
              {getNumberOfTasksCompleted()} of 3 tasks completed
            </Text>

            <ProgressList mt="24px">
              <ProgressListItem number={1} complete={stakeComplete}>
                <div ref={stakeStep}>
                  <StakeStep />
                </div>
              </ProgressListItem>
              <ProgressListItem number={2} complete={vouchComplete}>
                <div ref={vouchStep}>
                  <VouchersStep />
                </div>
              </ProgressListItem>
              <ProgressListItem number={3} complete={isMember}>
                <div ref={memberStep}>
                  <Card size="fluid" mb="24px">
                    <Card.Body>
                      <Heading level={2} size="large" grey={700}>
                        Join the network
                      </Heading>
                      <Text grey={500} size="medium">
                        Once you’ve completed the two previous steps, pay the 1
                        UNION fee to officially join the network as a Union
                        member and unlock the full Union experience.
                      </Text>

                      <Box
                        mt="16px"
                        className="Register__container"
                        justify="center"
                      >
                        <Box w="380px" direction="vertical" align="center">
                          <Box className="Register__fee" align="center">
                            <Text size="large" grey={700} m={0} weight="medium">
                              {format(protocol.newMemberFee, 2)}
                            </Text>

                            <UnionIcon width="24px" />
                          </Box>

                          <Text grey={500} m="8px 0 16px" weight="medium">
                            Membership fee is permanently burned
                          </Text>

                          <RegisterButton
                            onComplete={() => open(WELCOME_MODAL)}
                          />
                        </Box>
                      </Box>
                    </Card.Body>
                  </Card>
                </div>
              </ProgressListItem>
            </ProgressList>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </>
  );
}
