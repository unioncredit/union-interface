import { Layout } from "@unioncredit/ui";
import { useAccount, useNetwork } from "wagmi";

import Routes from "./Routes";

import ModalManager from "providers/ModalManager";
import MemberData from "providers/MemberData";
import VouchersData from "providers/VouchersData";
import VoucheesData from "providers/VoucheesData";
import ProtocolData from "providers/ProtocolData";
import GovernanceData from "providers/GovernanceData";
import ConnectPage from "pages/Connect";

export default function App() {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();

  if (chain?.unsupported || !isConnected) {
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
