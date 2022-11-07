import { useEffect } from "react";
import { Layout } from "@unioncredit/ui";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import Routes from "./Routes";

import ModalManager from "providers/ModalManager";
import MemberData from "providers/MemberData";
import VouchersData from "providers/VouchersData";
import VoucheesData from "providers/VoucheesData";
import ProtocolData from "providers/ProtocolData";
import GovernanceData from "providers/GovernanceData";
import ConnectPage from "pages/Connect";
import { useAppNetwork } from "providers/Network";

export default function App() {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { initialChain, setInitialChain } = useAppNetwork();

  useEffect(() => {
    if (isConnected && initialChain && chain.id) {
      if (initialChain !== chain.id) {
        (async () => {
          await switchNetworkAsync(initialChain);
          setInitialChain(null);
        })();
      } else {
        setInitialChain(null);
      }
    }
  }, [initialChain, chain?.id, isConnected, switchNetworkAsync]);

  if (chain?.unsupported || !isConnected || initialChain) {
    return <ConnectPage />;
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
                    <Routes />
                  </ModalManager>
                </VoucheesData>
              </VouchersData>
            </MemberData>
          </GovernanceData>
        </ProtocolData>
      </Layout.Main>
    </Layout>
  );
}
