import { useAccount } from "wagmi";
import { Layout } from "@unioncredit/ui";
import { Routes, Route } from "react-router-dom";

import ErrorPage from "pages/Error";
import CreditPage from "pages/Credit";
import ConnectPage from "pages/Connect";
import RegisterPage from "pages/Register";

import ModalManager from "providers/ModalManager";

export default function App() {
  const { isConnected } = useAccount();

  return (
    <ModalManager>
      <Layout>
        <Layout.Main>
          {!isConnected ? (
            <ConnectPage />
          ) : (
            <Routes>
              <Route path="/" element={<RegisterPage />} />
              <Route path="/credit" element={<CreditPage />} />
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
