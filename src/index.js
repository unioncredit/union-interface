import "./index.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

import App from "./App";
import Toasts from "providers/Toasts";
import AppLogs from "providers/AppLogs";
import MemberData from "providers/MemberData";
import reportWebVitals from "./reportWebVitals";
import VouchersData from "providers/VouchersData";
import VoucheesData from "providers/VoucheesData";
import ProtocolData from "providers/ProtocolData";

const client = createClient(
  getDefaultClient({
    appName: "Union Credit",
    infuraId: process.env.REACT_APP_INFURA_ID,
    chains: [chain.mainnet, chain.goerli],
  })
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HashRouter>
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="soft" mode="light">
        <Toasts>
          <AppLogs>
            <ProtocolData>
              <MemberData>
                <VouchersData>
                <VoucheesData>
                  <App />
                </VoucheesData>
                </VouchersData>
                
              </MemberData>
            </ProtocolData>
          </AppLogs>
        </Toasts>
      </ConnectKitProvider>
    </WagmiConfig>
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
