import "./Connect.scss";
import { useNetwork } from "wagmi";
import { Helmet } from "react-helmet";
import { Heading, Text, Box, Alert, WarningIcon } from "@unioncredit/ui";

import LoadingPage from "pages/Loading";
import Header from "components/shared/Header";
import Banner from "components/connect/Banner";
import { useMember } from "providers/MemberData";
import NetworkSelect from "components/connect/NetworkSelect";
import { useEffect } from "react";

export default function ConnectPage() {
  const { chain } = useNetwork();
  const { isLoading } = useMember();

  useEffect(() => {
    document.body.classList.add("white-background");

    return () => {
      document.body.classList.remove("white-background");
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingPage />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Connect | Union Credit Protocol</title>
      </Helmet>

      <Header showNav={false} />
      <Banner />
      <Box justify="center" fluid>
        <Box
          className="Connect__container"
          direction="vertical"
          w="100%"
          pb="2em"
          maxw="485px"
        >
          {chain?.unsupported && (
            <Alert
              mb="16px"
              align="center"
              icon={WarningIcon}
              label="Unsupported network selected in wallet"
            />
          )}
          <Heading>Select a Credit Network</Heading>
          <Text color="grey600" mt="0" mb="16px">
            Union’s networks are isolated, so it’s best to choose the network
            where your friends and DAO’s are.
          </Text>
          <NetworkSelect />
        </Box>
      </Box>
    </>
  );
}
