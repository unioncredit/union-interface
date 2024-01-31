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
  MobileProgressList,
  EthereumIcon,
} from "@unioncredit/ui";
import { Helmet } from "react-helmet";

import { WAD, ZERO } from "constants";
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
import useResponsive from "hooks/useResponsive";
import { useVersion } from "../providers/Version";
import { EthRegisterButton } from "../components/register/EthRegisterButton";

export default function RegisterPage() {
  const { isV2 } = useVersion();
  const { open } = useModals();
  const { data: protocol = {} } = useProtocol();
  const { data: vouchersData = [] } = useVouchers();
  const { data: member = {} } = useMember();
  const { isTablet } = useResponsive();

  const vouchers = vouchersData.filter((voucher) => voucher.stakedBalance?.gt(ZERO));

  const stakeStep = useRef();
  const vouchStep = useRef();
  const memberStep = useRef();

  const {
    isMember = false,
    unionBalance = ZERO,
    unclaimedRewards = ZERO,
    creditLimit = ZERO,
  } = member;

  const { regFee = ZERO, rebate = ZERO, newMemberFee = ZERO } = protocol;

  const ethRegisterFee = regFee.add(rebate);

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

  const vouchComplete = vouchers.length > 0;
  const stakeComplete = isMember || unionBalance?.add(unclaimedRewards).gte(WAD);

  const items = [
    { number: 1, complete: stakeComplete, scrollTo: stakeStep },
    { number: 2, complete: vouchComplete, anchor: "second", scrollTo: vouchStep },
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
              {isV2 && (
                <>
                  {" "}
                  (or{" "}
                  <a href="#step-3" style={{ textDecoration: "underline" }}>
                    skip to the end
                  </a>{" "}
                  if impatient)
                </>
              )}
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
              <ProgressListItem number={isV2 ? "1*" : 1} complete={stakeComplete}>
                <div ref={stakeStep}>
                  <StakeStep />
                </div>
              </ProgressListItem>
              <ProgressListItem number={isV2 ? "2*" : 2} complete={vouchComplete}>
                <div ref={vouchStep}>
                  <VouchersStep />
                </div>
              </ProgressListItem>
              <ProgressListItem number={3} complete={isMember}>
                <div ref={memberStep}>
                  <Card size="fluid" mb="24px">
                    <span id="step-3" />
                    <Card.Body>
                      <Heading level={2} size="large" grey={700}>
                        Claim your membership
                      </Heading>
                      <Text grey={500} size="medium">
                        Register your address in order to access{" "}
                        {creditLimit.gt(ZERO) && `your $${format(creditLimit)} in credit and`} all
                        the benefits of being a member of the union credit network
                      </Text>

                      <Box mt="16px" className="Register__container" justify="center">
                        <Box w="380px" direction="vertical" align="center">
                          <Box className="Register__fee" align="center">
                            <Text size="large" grey={700} m={0} weight="medium">
                              {isV2
                                ? format(ethRegisterFee, 10, false, true, false)
                                : format(newMemberFee, 2)}
                            </Text>

                            {isV2 ? (
                              <EthereumIcon width="16px" style={{ marginLeft: "5px" }} />
                            ) : (
                              <UnionIcon width="24px" />
                            )}
                          </Box>

                          {!isV2 && (
                            <Text grey={500} m="8px 0 16px" weight="medium">
                              Registering an Address costs 1 UNION
                            </Text>
                          )}

                          {isV2 ? (
                            <Box className="EthRegisterContainer">
                              <EthRegisterButton onComplete={() => open(WELCOME_MODAL)} />
                            </Box>
                          ) : (
                            <RegisterButton onComplete={() => open(WELCOME_MODAL)} />
                          )}
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
