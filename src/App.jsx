import { Box, Label, Layout } from "@unioncredit/ui";
import { useAccount, useNetwork } from "wagmi";

import Routes from "./Routes";

import ModalManager from "providers/ModalManager";
import MemberData from "providers/MemberData";
import VouchersData from "providers/VouchersData";
import VoucheesData from "providers/VoucheesData";
import ProtocolData from "providers/ProtocolData";
import GovernanceData from "providers/GovernanceData";
import ConnectPage from "pages/Connect";
import { useAppNetwork } from "providers/Network";
import { useEffect } from "react";
import Header from "components/shared/Header";

export default function App() {
  const { chain } = useNetwork();
  const { isConnected, isDisconnected } = useAccount();
  const { appReady, setAppReady } = useAppNetwork();

  useEffect(() => {
    if (appReady && (isDisconnected || chain?.unsupported)) {
      setAppReady(false);
    }
  }, [appReady, chain?.unsupported, isDisconnected]);

  if (chain?.unsupported || !isConnected) {
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
