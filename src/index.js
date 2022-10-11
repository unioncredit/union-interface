import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import MemberData from "providers/MemberData";
import VouchersData from "providers/VouchersData";

import "./index.scss";

const client = createClient(
  getDefaultClient({
    appName: "Union Credit",
    infuraId: process.env.REACT_APP_INFURA_ID,
    chains: [chain.goerli],
  })
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HashRouter>
      <WagmiConfig client={client}>
        <ConnectKitProvider theme="soft" mode="light">
          <MemberData>
            <VouchersData>
              <App />
            </VouchersData>
          </MemberData>
        </ConnectKitProvider>
      </WagmiConfig>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
