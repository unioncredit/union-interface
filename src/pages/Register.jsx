import "./Register.scss";

import { Helmet } from "react-helmet";
import {
  Grid,
  Heading,
  MobileProgressList,
  ProgressList,
  ProgressListItem,
  Text,
} from "@unioncredit/ui";

import { WAD, ZERO } from "constants";
import { useMember } from "providers/MemberData";
import { useToken } from "hooks/useToken";
import { useVouchers } from "../providers/VouchersData";
import { useRef, useState } from "react";
import useResponsive from "../hooks/useResponsive";
import StakeStep from "../components/register/StakeStep";
import VouchersStep from "../components/register/VouchersStep";
import { RegisterStep } from "../components/register/RegisterStep";

export default function RegisterPage() {
  const [skippedSteps, setSkippedSteps] = useState({
    stake: false,
    share: false,
  });

  const { token } = useToken();
  const { data: vouchersData = [] } = useVouchers();
  const { data: member = {} } = useMember();
  const { isTablet } = useResponsive();

  const vouchers = vouchersData.filter((voucher) => voucher.stakedBalance?.gt(ZERO));

  const stakeStep = useRef();
  const vouchStep = useRef();
  const memberStep = useRef();

  const { isMember = false, unionBalance = ZERO, unclaimedRewards = ZERO } = member;

  const getNumberOfTasksCompleted = () => {
    let completed = 0;

    if (unionBalance?.add(unclaimedRewards).gt(0) || skippedSteps.stake) {
      completed++;
    }
    if (vouchers.length > 0 || skippedSteps.share) {
      completed++;
    }
    if (isMember) {
      completed++;
    }

    return completed;
  };

  const vouchComplete = vouchers.length > 0 || skippedSteps.share;
  const stakeComplete =
    isMember || unionBalance?.add(unclaimedRewards).gte(WAD[token]) || skippedSteps.stake;

  const items = [
    { number: 1, complete: stakeComplete, scrollTo: stakeStep },
    {
      number: 2,
      complete: vouchComplete,
      anchor: "second",
      scrollTo: vouchStep,
    },
    { number: 3, complete: isMember, anchor: "third", scrollTo: memberStep },
  ];

  return (
    <>
      <Helmet>
        <title>Register | Union Credit Protocol</title>
      </Helmet>
      <Grid className="Register">
        <Grid.Row justify="center">
          <Grid.Col xs={11} md={8.1} className="Register__col">
            <Heading level={1} mb="0" className="Register__heading" grey={800}>
              Getting Started on Union
            </Heading>
            <Text m={0} grey={500} size="medium">
              {getNumberOfTasksCompleted()} of 3 tasks completed
              <>
                {" "}
                (or{" "}
                <a href="#step-3" style={{ textDecoration: "underline" }}>
                  skip to the end
                </a>{" "}
                and register)
              </>
            </Text>

            {isTablet && (
              <div
                style={{
                  zIndex: 100,
                  position: "fixed",
                  bottom: "24px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <MobileProgressList items={items} />
              </div>
            )}

            <ProgressList mt="24px">
              <ProgressListItem number={"1"} complete={stakeComplete}>
                <div ref={stakeStep}>
                  <StakeStep
                    complete={stakeComplete}
                    onSkipStep={() => setSkippedSteps((s) => ({ ...s, stake: true }))}
                  />
                </div>
              </ProgressListItem>
              <ProgressListItem number={"2"} complete={vouchComplete}>
                <div ref={vouchStep}>
                  <VouchersStep
                    complete={vouchComplete}
                    onSkipStep={() => setSkippedSteps((s) => ({ ...s, share: true }))}
                  />
                </div>
              </ProgressListItem>
              <ProgressListItem number={3} complete={isMember}>
                <div ref={memberStep}>
                  <RegisterStep />
                </div>
              </ProgressListItem>
            </ProgressList>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </>
  );
}
