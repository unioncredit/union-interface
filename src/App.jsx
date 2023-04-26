import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { Box, Label, Layout, Grid } from "@unioncredit/ui";
import { matchRoutes, useLocation } from "react-router-dom";

import Routes from "./Routes";

import ConnectPage from "pages/Connect";
import Header from "components/shared/Header";
import { general as generalRoutes } from "App.routes";
import ScrollToTop from "components/misc/ScrollToTop";

import Cache from "providers/Cache";
import ModalManager from "providers/ModalManager";
import VouchersData from "providers/VouchersData";
import VoucheesData from "providers/VoucheesData";
import ProtocolData from "providers/ProtocolData";
import { useAppNetwork } from "providers/Network";
import useMemberListener from "hooks/useMemberListener";
import GovernanceData from "providers/GovernanceData";
import MemberData, { useMember } from "providers/MemberData";
import { isVersionSupported, useVersion } from "providers/Version";
import Settings from "providers/Settings";
import useChainParams from "hooks/useChainParams";

/**
 * Shim component that checks if the App is ready
 */
function AppReadyShim({ children }) {
  const location = useLocation();

  const { chain } = useNetwork();
  const { version } = useVersion();
  const { isDisconnected } = useAccount();
  const { data: member = {} } = useMember();
  const { appReady, setAppReady } = useAppNetwork();

  const isGeneralRoute = Boolean(matchRoutes(generalRoutes, location));

  useMemberListener();
  useChainParams();

  useEffect(() => {
    if (appReady && (isDisconnected || chain?.unsupported)) {
      setAppReady(false);
      return;
    }

    // If the user is a member, or we are accessing a general route, then
    // skip the connect/ready page and auto connect straight into
    // the credit page "/"
    if (!appReady && member.isMember) {
      // Check if the currently verions matches the network. Only if
      // the version is set correctly can we proceed
      if (isVersionSupported(version, chain.id)) {
        setAppReady(true);
        return;
      }
    }

    // If we are viewing a general route such as governance or
    // a member profile then we skip the ready (connect) page
    if (!appReady && isGeneralRoute) {
      setAppReady(true);
    }
  }, [
    appReady,
    member?.isMember,
    chain?.unsupported,
    isDisconnected,
    isGeneralRoute,
  ]);

  return <>{children}</>;
}

export default function App() {
  const location = useLocation();

  const { chain } = useNetwork();
  const { version } = useVersion();
  const { isConnected } = useAccount();
  const { appReady } = useAppNetwork();

  const isGeneralRoute = Boolean(matchRoutes(generalRoutes, location));

  if (!version || ((chain?.unsupported || !isConnected) && !isGeneralRoute)) {
    return (
      <AppReadyShim>
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
      </AppReadyShim>
    );
  }

  return (
    <Layout>
      <ScrollToTop />
      <Layout.Main>
        <Grid style={{ display: "flex", flexGrow: 1 }}>
          <Grid.Row style={{ width: "100%", margin: 0 }}>
            <Grid.Col>
              <Settings>
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
              </Settings>
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
