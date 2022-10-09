import { useAccount } from "wagmi";
import { Heading, Text, Grid } from "@unioncredit/ui";

import Header from "components/connect/Header";
import NetworkSelect from "components/connect/NetworkSelect";

export default function ConnectPage() {
  const { isConnected } = useAccount();

  return (
    <Grid>
      <Grid.Row justify="center">
        <Grid.Col xs={6}>
          <Header />
          <Heading mt="120px" mb="0">
            Connect to a Credit Network
          </Heading>
          <Text mt="0" mb="16px">
            Select one of Union’s credit networks
          </Text>
          <NetworkSelect disabled={!isConnected} />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}
