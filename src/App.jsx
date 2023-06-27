import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { Box, Layout, Grid } from "@unioncredit/ui";
import { matchRoutes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import Routes from "./Routes";

import ConnectPage from "pages/Connect";
import { Header } from "components/shared/Header";
import { allRoutes, general as generalRoutes } from "App.routes";
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
import ErrorPage from "pages/Error";
import { BuildInfo } from "components/shared/BuildInfo";
import LoadingPage from "pages/Loading";
import NotFoundPage from "pages/NotFoundPage";

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

  useMemberListener();
  useChainParams();

  useEffect(() => {
    // If we are viewing a general route such as governance or
    // a member profile then we skip the ready (connect) page
    if (isGeneralRoute) {
      !appReady && setAppReady(true);
      return;
    }

    if (chain && appReady && (isDisconnected || chain?.unsupported)) {
      setAppReady(false);
    }
  }, [
    appReady,
    member?.isMember,
    chain?.unsupported,
    isDisconnected,
    isGeneralRoute,
    JSON.stringify(chain),
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

  const is404 = !allRoutes.some((r) => {
    // Exact match
    if (r.path === location.pathname) return true;

    // Check for paths parameters
    if (r.path.includes(":")) {
      const index = r.path.indexOf(":");
      const substring = index !== -1 ? r.path.substring(0, index) : r.path;
      return location.pathname.startsWith(substring);
    }
  });

  if (!version || ((chain?.unsupported || !isConnected) && !isGeneralRoute)) {
    return (
      <AppReadyShim>
        <Layout>
          <ScrollToTop />
          <Layout.Main>
            <Header showNav={false} />
            <Grid style={{ display: "flex", flexGrow: 1 }}>
              <Grid.Row style={{ width: "100%", margin: 0 }}>
                <Grid.Col>
                  <ErrorBoundary FallbackComponent={ErrorPage}>
                    {is404 ? <NotFoundPage /> : <ConnectPage />}
                  </ErrorBoundary>
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
        <Settings>
          <Cache>
            <ProtocolData>
              <GovernanceData>
                <MemberData>
                  <VouchersData>
                    <VoucheesData>
                      <ModalManager>
                        <AppReadyShim>
                          <Header />
                          {!chain || isVersionSupported(version, chain?.id) ? (
                            <Grid style={{ display: "flex", flexGrow: 1 }}>
                              <Grid.Row style={{ width: "100%", margin: 0 }}>
                                <Grid.Col>
                                  {is404 ? (
                                    <NotFoundPage />
                                  ) : appReady ? (
                                    <>
                                      <ErrorBoundary FallbackComponent={ErrorPage}>
                                        <Layout.Columned>
                                          <Routes />
                                        </Layout.Columned>
                                      </ErrorBoundary>
                                    </>
                                  ) : (
                                    <ConnectPage />
                                  )}
                                </Grid.Col>
                              </Grid.Row>
                            </Grid>
                          ) : (
                            <LoadingPage />
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
        <Box mt="56px" mb="24px" w="100%">
          <BuildInfo />
        </Box>
      </Layout.Main>
    </Layout>
  );
}
