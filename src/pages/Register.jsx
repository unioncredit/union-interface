import "./Register.scss";

import {
  Card,
  Grid,
  Heading,
  ProgressList,
  ProgressListItem,
  Text,
  Box,
  Divider,
  Label,
  MiniProgressList,
} from "@unioncredit/ui";
import { Helmet } from "react-helmet";
import { ReactComponent as Logo } from "@unioncredit/ui/lib/icons/union.svg";

import { ZERO } from "constants";
import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useVouchers } from "providers/VouchersData";
import { useProtocol } from "providers/ProtocolData";
import StakeStep from "components/register/StakeStep";
import VouchersStep from "components/register/VouchersStep";
import RegisterButton from "components/register/RegisterButton";
import { useModals } from "providers/ModalManager";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useRef } from "react";

export default function RegisterPage() {
  const { open } = useModals();
  const { data: protocol = {} } = useProtocol();
  const { data: vouchersData = [] } = useVouchers();
  const { data: member = {}, refetch: refetchMember } = useMember();
  const vouchers = vouchersData.filter((voucher) =>
    voucher.stakedBalance?.gt(ZERO)
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

  const miniProgressListItems = [
    { number: 1, complete: stakeComplete, scrollTo: stakeStep },
    { number: 2, complete: vouchComplete, scrollTo: vouchStep },
    { number: 3, complete: isMember, scrollTo: memberStep },
  ];

  return (
    <>
      <Helmet>
        <title>Register | Union Credit Protocol</title>
      </Helmet>
      <Grid className="Register">
        <Grid.Row justify="center">
          <Grid.Col xs={11} md={8} className="Register__col">
            <Heading mb="0" className="Register__heading">
              Become a Union member
            </Heading>
            <Text mt="0" mb="16px">
              {getNumberOfTasksCompleted()} of 3 tasks completed
            </Text>

            <ProgressList>
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
                    <Card.Header
                      title="Complete Membership"
                      subTitle="Once you’ve got at least 1 vouch and have earned enough UNION for your membership fee; claim and pay 1 UNION to finalize your membership."
                    />
                    <Card.Body>
                      <Divider mb="56px" />
                      <Box justify="center" mb="32px">
                        <Box w="380px" direction="vertical" align="center">
                          <Logo width="32px" />
                          <Heading size="large" grey={700} mb={0} mt="2px">
                            {format(protocol.newMemberFee, 0)} UNION
                          </Heading>
                          <Label m={0} grey={500} mb="24px">
                            Membership Fee
                          </Label>
                          <RegisterButton
                            onComplete={() =>
                              open(VOUCH_MODAL, {
                                title: "Vouch for a friend",
                                subTitle:
                                  "Expand the web of trust with a vouch",
                                showNewMemberHeader: true,
                                onClose: () => refetchMember(),
                              })
                            }
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
      <div className="MiniProgressListContainer">
        <MiniProgressList items={miniProgressListItems} />
      </div>
    </>
  );
}
