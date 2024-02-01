import "./Connect.scss";
import { useEffect } from "react";
import { useNetwork } from "wagmi";
import { Helmet } from "react-helmet";
import { Box, Heading, InfoBanner, Text, WarningIcon } from "@unioncredit/ui";

import LoadingPage from "pages/Loading";
import Banner from "components/connect/Banner";
import NetworkSelect from "components/connect/NetworkSelect";
import { useMember } from "providers/MemberData";
import { useVersion } from "providers/Version";

export default function ConnectPage() {
  const { chain } = useNetwork();
  const { isLoading } = useMember();
  const { isV2 } = useVersion();

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
      <Box direction="vertical" align="center" fluid>
        {!chain?.unsupported && isV2 && (
          <Box mt="24px">
            <a
              target="_blank"
              rel="noreferrer"
              style={{ width: "100%" }}
              href="https://app.union.finance/"
            >
              <InfoBanner
                icon={WarningIcon}
                variant="warning"
                label={"You are connected to a V2 network, click here to access the main app."}
              />
            </a>
          </Box>
        )}

        {chain?.unsupported && (
          <Box mt="24px">
            <InfoBanner
              align="center"
              icon={WarningIcon}
              label="You are connected to an unsupported network, choose a network below."
              style={{ cursor: "pointer" }}
            />
          </Box>
        )}

        <Box className="Connect__container" direction="vertical" w="100%" pb="2em" maxw="485px">
          <Heading>Select a Credit Network</Heading>
          <Text color="grey600" mt="0" mb="16px">
            Union’s networks are isolated, so it’s best to choose the network where your friends and
            DAO’s are.
          </Text>
          <NetworkSelect />
        </Box>
      </Box>
    </>
  );
}
