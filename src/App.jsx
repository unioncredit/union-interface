import { useEffect } from "react";
import { useAccount } from "wagmi";
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
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

// Created once at module scope. Previously constructed inside App(), which gave
// every render a brand-new client and an empty InMemoryCache — App re-renders on
// each account/chain/route change, so Ponder queries were torn down, re-subscribed
// and refetched continuously, and cached data was thrown away.
const apolloClient = new ApolloClient({
  uri: import.meta.env.REACT_APP_PONDER_URL,
  cache: new InMemoryCache(),
});

export default function App() {
  useChainParams();

  const location = useLocation();

  const { chain } = useAccount();
  const { version } = useVersion();
  const { isConnected } = useAccount();
  const { set: setReferrer } = useReferrer();

  // Parses referrer address from "refAddress" query parameter and
  // stores it in local storage. Runs in an effect — calling setReferrer during
  // render is an impure render (extra render pass, unsafe under StrictMode /
  // concurrent rendering).
  const [searchParams] = useSearchParams();
  const referrer = searchParams.get("refAddress");
  useEffect(() => {
    if (referrer) setReferrer(referrer);
  }, [referrer, setReferrer]);

  if (!version || ((chain?.unsupported || !isConnected) && !isGeneralRoute(location))) {
    return (
      <Layout>
        <ScrollToTop />
        <Layout.Main>
          <ModalManager>
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
          </ModalManager>
        </Layout.Main>
        <Analytics />
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollToTop />
      <Layout.Main>
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <Settings>
            <Cache>
              <ApolloProvider client={apolloClient}>
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
              </ApolloProvider>
            </Cache>
          </Settings>
        </ErrorBoundary>
        <Box mt="56px" mb="24px" w="100%">
          <FooterLinks />
        </Box>
      </Layout.Main>
    </Layout>
  );
}

function AppReadyShim() {
  const location = useLocation();
  const { version } = useVersion();
  const { isSupported } = useSupportedNetwork();
  const { chain, isConnected } = useAccount();
  const { data: member } = useMember();
  const { forceAppReady } = useAppNetwork();
  useMemberListener();

  const appReady =
    forceAppReady ||
    isGeneralRoute(location) ||
    (isConnected && !chain?.unsupported && isSupported(chain?.id) && member?.isMember);

  return isGeneralRoute(location) || isVersionSupported(version, chain?.id) ? (
    <Grid style={{ display: "flex", flexGrow: 1 }}>
      <Grid.Row style={{ width: "100%", margin: 0 }}>
        <Grid.Col>
          <ModalManager>
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
          </ModalManager>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  ) : (
    <LoadingPage />
  );
}
