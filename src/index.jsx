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
import { init } from "@airstack/airstack-react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "pages/Error";

init(import.meta.env.REACT_APP_AIRSTACK_API_KEY);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <Network>
        <Version>
          <Toasts>
            <AppLogs>
              <App />
            </AppLogs>
          </Toasts>
        </Version>
      </Network>
    </ErrorBoundary>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
