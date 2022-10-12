import {
  Card,
  Grid,
  Heading,
  ProgressList,
  ProgressListItem,
  Text,
  Box,
  Divider,
} from "@unioncredit/ui";

import Header from "components/shared/Header";
import StakeStep from "components/register/StakeStep";
import VouchersStep from "components/register/VouchersStep";
import RegisterButton from "components/register/RegisterButton";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <Grid>
        <Grid.Row justify="center">
          <Grid.Col xs={8}>
            <Heading mt="48px" mb="0">
              Become a Union member
            </Heading>
            <Text mt="0" mb="16px">
              1 of 3 tasks completed
            </Text>

            <ProgressList>
              <ProgressListItem number={1} complete={true}>
                <div ref={null}>
                  <StakeStep />
                </div>
              </ProgressListItem>
              <ProgressListItem number={2} complete={false}>
                <div ref={null}>
                  <VouchersStep />
                </div>
              </ProgressListItem>
              <ProgressListItem number={3} complete={false}>
                <div ref={null}>
                  <Card size="fluid" mb="24px">
                    <Card.Header
                      title="Complete Membership"
                      subTitle="Once you’ve got at least 1 vouch and have earned enough UNION for your membership fee; claim and pay 1 UNION to finalize your membership."
                    />
                    <Card.Body>
                      <Divider mb="56px" />
                      <Box justify="center" mb="6px">
                        <Box w="380px">
                          <RegisterButton />
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
