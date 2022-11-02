import "./index.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ConnectKitProvider } from "connectkit";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Toasts from "providers/Toasts";
import Network from "providers/Network";
import AppLogs from "providers/AppLogs";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HashRouter>
    <Network>
      <ConnectKitProvider theme="soft" mode="light">
        <Toasts>
          <AppLogs>
            <App />
          </AppLogs>
        </Toasts>
      </ConnectKitProvider>
    </Network>
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
