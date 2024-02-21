import { useAccount, useNetwork } from "wagmi";
import { Box, Grid, Layout } from "@unioncredit/ui";
import { useLocation, useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Analytics } from "@vercel/analytics/react";

import Routes from "./Routes";

import ConnectPage from "pages/Connect";
import { Header } from "components/shared/Header";
import ScrollToTop from "components/misc/ScrollToTop";

import Cache from "providers/Cache";
import ModalManager from "providers/ModalManager";
import VouchersData from "providers/VouchersData";
import VoucheesData from "providers/VoucheesData";
import ProtocolData from "providers/ProtocolData";
import useMemberListener from "hooks/useMemberListener";
import GovernanceData from "providers/GovernanceData";
import MemberData, { useMember } from "providers/MemberData";
import { isVersionSupported, useVersion } from "providers/Version";
import Settings from "providers/Settings";
import useChainParams from "hooks/useChainParams";
import ErrorPage from "pages/Error";
import { FooterLinks } from "components/shared/FooterLinks";
import LoadingPage from "pages/Loading";
import NotFoundPage from "pages/NotFoundPage";
import { useSupportedNetwork } from "./hooks/useSupportedNetwork";
import { is404, isGeneralRoute } from "./utils/routes";
import { useAppNetwork } from "./providers/Network";
import useReferrer from "./hooks/useReferrer";

export default function App() {
  useMemberListener();
  useChainParams();

  const location = useLocation();

  const { chain } = useNetwork();
  const { version } = useVersion();
  const { isConnected } = useAccount();
  const { set: setReferrer } = useReferrer();

  // Parses referrer address from "refAddress" query parameter and
  // stores it in local storage
  const [searchParams] = useSearchParams();
  const referrer = searchParams.get("refAddress");
  if (referrer) {
    setReferrer(referrer);
  }

  if (!version || ((chain?.unsupported || !isConnected) && !isGeneralRoute(location))) {
    return (
      <Layout>
        <ScrollToTop />
        <Layout.Main>
          <Header />
          <Grid style={{ display: "flex", flexGrow: 1 }}>
            <Grid.Row style={{ width: "100%", margin: 0 }}>
              <Grid.Col>
                <ErrorBoundary FallbackComponent={ErrorPage}>
                  {is404(location) ? <NotFoundPage /> : <ConnectPage />}
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
                        <AppReadyShim />
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

function AppReadyShim() {
  const location = useLocation();
  const { chain } = useNetwork();
  const { version } = useVersion();
  const { isSupported } = useSupportedNetwork();
  const { isConnected } = useAccount();
  const { data: member } = useMember();
  const { forceAppReady } = useAppNetwork();

  const appReady =
    forceAppReady ||
    isGeneralRoute(location) ||
    (isConnected && !chain?.unsupported && isSupported(chain?.id) && member?.isMember);

  return isGeneralRoute(location) || isVersionSupported(version, chain?.id) ? (
    <Grid style={{ display: "flex", flexGrow: 1 }}>
      <Grid.Row style={{ width: "100%", margin: 0 }}>
        <Grid.Col>
          {is404(location) ? (
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
  );
}
