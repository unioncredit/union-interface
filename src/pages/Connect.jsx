import "./Connect.scss";
import { useEffect } from "react";
import { useNetwork } from "wagmi";
import { Helmet } from "react-helmet";
import { Heading, Text, Box, InfoBanner, WarningIcon } from "@unioncredit/ui";

import LoadingPage from "pages/Loading";
import Banner from "components/connect/Banner";
import { useMember } from "providers/MemberData";
import NetworkSelect from "components/connect/NetworkSelect";

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
    return <LoadingPage />;
  }

  return (
    <>
      <Helmet>
        <title>Connect | Union Credit Protocol</title>
      </Helmet>

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
            <InfoBanner
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
