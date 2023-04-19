import "./Connect.scss";
import { useEffect } from "react";
import { useNetwork } from "wagmi";
import { Helmet } from "react-helmet";
import {
  ToggleMenu,
  Heading,
  Text,
  Box,
  InfoBanner,
  WarningIcon,
  SegmentedControl,
} from "@unioncredit/ui";

import LoadingPage from "pages/Loading";
import Banner from "components/connect/Banner";
import { useMember } from "providers/MemberData";
import NetworkSelect from "components/connect/NetworkSelect";
import { useVersion, Versions } from "providers/Version";

export default function ConnectPage() {
  const { chain } = useNetwork();
  const { isLoading } = useMember();
  const { version, setVersion } = useVersion();

  useEffect(() => {
    document.body.classList.add("white-background");

    return () => {
      document.body.classList.remove("white-background");
    };
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  const onToggleVersion = (value) => {
    setVersion(value.id === Versions.V1 ? 1 : 2);
  };

  const versionToggleItems = [
    { id: Versions.V1, label: "Union v1" },
    { id: Versions.V2, label: "Union v2" },
  ];

  const initialActive0 = versionToggleItems.findIndex(
    (item) => item.id === version
  );
  const initialActive = !!~initialActive0 ? initialActive0 : 0;

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
          <Box mb="16px" fluid>
            <SegmentedControl
              fluid
              items={versionToggleItems}
              onChange={onToggleVersion}
              initialActive={initialActive}
            />
          </Box>
          <NetworkSelect />
        </Box>
      </Box>
    </>
  );
}
