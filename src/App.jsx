import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { Box, Label, Layout, Grid } from "@unioncredit/ui";
import { matchRoutes, useLocation } from "react-router-dom";

import Routes from "./Routes";

import ModalManager from "providers/ModalManager";
import MemberData, { useMember } from "providers/MemberData";
import VouchersData from "providers/VouchersData";
import VoucheesData from "providers/VoucheesData";
import ProtocolData from "providers/ProtocolData";
import GovernanceData from "providers/GovernanceData";
import ConnectPage from "pages/Connect";
import { useAppNetwork } from "providers/Network";
import Cache from "providers/Cache";
import Header from "components/shared/Header";
import { general as generalRoutes } from "App.routes";
import ScrollToTop from "components/misc/ScrollToTop";

/**
 * Shim component that checks if the App is ready
 */
function AppReadyShim({ children }) {
  const location = useLocation();

  const { chain } = useNetwork();
  const { isDisconnected } = useAccount();
  const { data: member = {} } = useMember();
  const { appReady, setAppReady } = useAppNetwork();

  const isGeneralRoute = Boolean(matchRoutes(generalRoutes, location));

  useEffect(() => {
    // If the member is a member then skip the connect/ready page
    // and auto connect straight into the credit page "/"
    if (member.isMember) {
      setAppReady(true);
      return;
    }

    // The app is currently set to ready but the chain is not
    // connected or is unsupported
    if (appReady && (isDisconnected || chain?.unsupported)) {
      setAppReady(false);
    }

    // If we are viewing a general route such as governance or
    // a member profile then we skip the ready (connect) page
    if (isGeneralRoute) {
      setAppReady(true);
    }
  }, [
    member.isMember,
    appReady,
    chain?.unsupported,
    isDisconnected,
    isGeneralRoute,
  ]);

  return <>{children}</>;
}

export default function App() {
  const location = useLocation();

  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { appReady } = useAppNetwork();

  const isGeneralRoute = Boolean(matchRoutes(generalRoutes, location));

  if ((chain?.unsupported || !isConnected) && !isGeneralRoute) {
    return (
      <Layout>
        <ScrollToTop />
        <Layout.Main>
          <Grid style={{ display: "flex", flexGrow: 1 }}>
            <Grid.Row style={{ width: "100%", margin: 0 }}>
              <Grid.Col>
                <ConnectPage />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </Layout.Main>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollToTop />
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
                            <AppReadyShim>
                              {appReady ? (
                                <>
                                  <Header />
                                  <Routes />
                                </>
                              ) : (
                                <ConnectPage />
                              )}
                            </AppReadyShim>
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
