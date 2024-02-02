import { useAccount, useNetwork } from "wagmi";
import { Box, Grid, Layout } from "@unioncredit/ui";
import { matchRoutes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Analytics } from "@vercel/analytics/react";

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
import useMemberListener from "hooks/useMemberListener";
import GovernanceData from "providers/GovernanceData";
import MemberData from "providers/MemberData";
import { isVersionSupported, useVersion } from "providers/Version";
import Settings from "providers/Settings";
import useChainParams from "hooks/useChainParams";
import ErrorPage from "pages/Error";
import { FooterLinks } from "components/shared/FooterLinks";
import LoadingPage from "pages/Loading";
import NotFoundPage from "pages/NotFoundPage";
import { useSupportedNetwork } from "./hooks/useSupportedNetwork";

export default function App() {
  useMemberListener();
  useChainParams();

  const location = useLocation();

  const { chain } = useNetwork();
  const { version } = useVersion();
  const { isConnected } = useAccount();
  const { isSupported } = useSupportedNetwork();

  const isGeneralRoute = Boolean(matchRoutes(generalRoutes, location));

  const appReady = isGeneralRoute || (isConnected && !chain?.unsupported && isSupported(chain?.id));

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
      <Layout>
        <ScrollToTop />
        <Layout.Main>
          <Header />
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
        <Analytics />
      </Layout>
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
                        <Header />
                        {isGeneralRoute || isVersionSupported(version, chain?.id) ? (
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
                      </ModalManager>
                    </VoucheesData>
                  </VouchersData>
                </MemberData>
              </GovernanceData>
            </ProtocolData>
          </Cache>
        </Settings>
        <Box mt="56px" mb="24px" w="100%">
          <FooterLinks />
        </Box>
      </Layout.Main>
    </Layout>
  );
}
