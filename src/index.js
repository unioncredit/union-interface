import "./index.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Toasts from "providers/Toasts";
import Network from "providers/Network";
import AppLogs from "providers/AppLogs";
import Version from "providers/Version";
import AppReadyState from "providers/AppReadyState";

// eslint-disable-next-line no-undef
window.Buffer = window.Buffer || require("buffer").Buffer;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <AppReadyState>
      <Version>
        <Network>
          <Toasts>
            <AppLogs>
              <App />
            </AppLogs>
          </Toasts>
        </Network>
      </Version>
    </AppReadyState>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
