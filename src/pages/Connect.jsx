import { Helmet } from "react-helmet";
import { Heading, Label, Text, Grid, Box, Alert } from "@unioncredit/ui";

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
                  icon={
                    <svg
                      width="25"
                      height="24"
                      fill="none"
                      viewBox="0 0 25 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.7568 5.09901C11.5218 3.73901 13.4788 3.73901 14.2428 5.09901L19.8228 15.019C20.5728 16.353 19.6098 17.999 18.0808 17.999H6.91985C5.38985 17.999 4.42685 16.353 5.17685 15.019L10.7568 5.09901ZM13.4998 15C13.4998 15.2652 13.3945 15.5196 13.207 15.7071C13.0194 15.8947 12.7651 16 12.4998 16C12.2346 16 11.9803 15.8947 11.7927 15.7071C11.6052 15.5196 11.4998 15.2652 11.4998 15C11.4998 14.7348 11.6052 14.4804 11.7927 14.2929C11.9803 14.1054 12.2346 14 12.4998 14C12.7651 14 13.0194 14.1054 13.207 14.2929C13.3945 14.4804 13.4998 14.7348 13.4998 15ZM12.4998 7.00001C12.2346 7.00001 11.9803 7.10537 11.7927 7.2929C11.6052 7.48044 11.4998 7.73479 11.4998 8.00001V11C11.4998 11.2652 11.6052 11.5196 11.7927 11.7071C11.9803 11.8947 12.2346 12 12.4998 12C12.7651 12 13.0194 11.8947 13.207 11.7071C13.3945 11.5196 13.4998 11.2652 13.4998 11V8.00001C13.4998 7.73479 13.3945 7.48044 13.207 7.2929C13.0194 7.10537 12.7651 7.00001 12.4998 7.00001Z"
                        fill="#92400E"
                      />
                    </svg>
                  }
                  label={
                    <Label m={0} color="amber800">
                      Unsupported network selected in wallet
                    </Label>
                  }
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
