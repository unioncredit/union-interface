import { Helmet } from "react-helmet";
import { Heading, Text, Grid, Box, Alert } from "@unioncredit/ui";

import Header from "components/connect/Header";
import NetworkSelect from "components/connect/NetworkSelect";
import { useNetwork } from "wagmi";

export default function ConnectPage() {
  const { chain } = useNetwork();

  return (
    <Grid className="ConnectPage">
      <Helmet>
        <title>Connect | Union Credit Protocol</title>
      </Helmet>
      <Grid.Row justify="center">
        <Grid.Col xs={11} md={6}>
          <Header />
          <Box justify="center" fluid>
            <Box maxw="420px" direction="vertical">
              {chain?.unsupported && (
                <Alert
                  m={0}
                  align="center"
                  label="Unsupported network selected in wallet"
                />
              )}
              <Heading mt={chain?.unsupported ? "72px" : "120px"} mb="0">
                Connect to a Credit Network
              </Heading>
              <Text mt="0" mb="16px">
                Select one of Union’s credit networks
              </Text>
              <NetworkSelect />
            </Box>
          </Box>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}
