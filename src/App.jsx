import { useAccount, useNetwork } from "wagmi";
import { Layout } from "@unioncredit/ui";
import { Routes, Route } from "react-router-dom";

import ErrorPage from "pages/Error";
import CreditPage from "pages/Credit";
import ConnectPage from "pages/Connect";
import RegisterPage from "pages/Register";
import LoadingPage from "pages/Loading";

import { useMember } from "providers/MemberData";
import ModalManager from "providers/ModalManager";

export default function App() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data, isLoading } = useMember();

  return (
    <ModalManager>
      <Layout>
        <Layout.Main>
          {!isConnected || chain.unsupported ? (
            <ConnectPage />
          ) : isLoading ? (
            <LoadingPage />
          ) : (
            <Routes>
              {!data.checkIsMember ? (
                <Route path="/" element={<CreditPage />} />
              ) : (
                <Route path="/" element={<RegisterPage />} />
              )}
              <Route
                path="*"
                element={
                  <ErrorPage
                    title="Oh no! You just came across an error."
                    body="Something broke while you were using the app. Try reloading the page or use one of the helpful links below."
                  />
                }
              />
            </Routes>
          )}
        </Layout.Main>
      </Layout>
    </ModalManager>
  );
}
