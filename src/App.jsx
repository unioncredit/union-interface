import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { Box, Label, Layout, Grid } from "@unioncredit/ui";
import { matchRoutes, useLocation } from "react-router-dom";

import Routes from "./Routes";

import ModalManager from "providers/ModalManager";
import MemberData from "providers/MemberData";
import VouchersData from "providers/VouchersData";
import VoucheesData from "providers/VoucheesData";
import ProtocolData from "providers/ProtocolData";
import GovernanceData from "providers/GovernanceData";
import ConnectPage from "pages/Connect";
import { useAppNetwork } from "providers/Network";
import Cache from "providers/Cache";
import Header from "components/shared/Header";
import { general as generalRoutes } from "App.routes";

export default function App() {
  const location = useLocation();

  const { chain } = useNetwork();
  const { isConnected, isDisconnected } = useAccount();
  const { appReady, setAppReady } = useAppNetwork();

  const isGeneralRoute = Boolean(matchRoutes(generalRoutes, location));

  useEffect(() => {
    if (appReady && (isDisconnected || chain?.unsupported)) {
      setAppReady(false);
    }

    if (isGeneralRoute) {
      setAppReady(true);
    }
  }, [appReady, chain?.unsupported, isDisconnected, isGeneralRoute]);

  if ((chain?.unsupported || !isConnected) && !isGeneralRoute) {
    return (
      <Layout>
        <Layout.Main>
          <ConnectPage />
        </Layout.Main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.Main>
        <Grid style={{ display: "flex", flexGrow: 1 }}>
          <Grid.Row style={{ width: "100%", margin: 0 }}>
            <Grid.Col>
              <Cache>
                <ProtocolData>
                  <GovernanceData>
                    <MemberData>
                      <VouchersData>
                        <VoucheesData>
                          <ModalManager>
                            {appReady ? (
                              <>
                                <Header />
                                <Routes />
                              </>
                            ) : (
                              <ConnectPage />
                            )}
                          </ModalManager>
                        </VoucheesData>
                      </VouchersData>
                    </MemberData>
                  </GovernanceData>
                </ProtocolData>
              </Cache>
            </Grid.Col>
          </Grid.Row>
        </Grid>
        <Box mt="56px" mb="24px" w="100%">
          <Box justify="center" fluid>
            <Label as="p" size="small" grey={300} align="center">
              Build: {process.env.REACT_APP_VERSION}
            </Label>
          </Box>
        </Box>
      </Layout.Main>
    </Layout>
  );
}
