import { createContext, useContext, useState } from "react";

const AppLogsContext = createContext({});

export const useAppLogs = () => useContext(AppLogsContext);

const APP_LOG_STORAGE_KEY = "APP_LOG_STORAGE";

const initialValue = JSON.parse(
  window.localStorage.getItem(APP_LOG_STORAGE_KEY) || "[]"
);

export default function AppLogs({ children }) {
  const [logs, setLogs] = useState(initialValue);

  const addLog = (props) => {
    if (!props) return;
    const { status, label, value, txHash } = props;
    const newLogs = [...logs, { status, label, value, txHash }];

    setLogs(newLogs);
    window.localStorage.setItem(APP_LOG_STORAGE_KEY, JSON.stringify(newLogs));
  };

  const clearLogs = () => {
    window.localStorage.setItem(APP_LOG_STORAGE_KEY, JSON.stringify([]));
  };

  const appLogsCtx = {
    logs,
    addLog,
    clearLogs,
  };

  return (
    <AppLogsContext.Provider value={appLogsCtx}>
      {children}
    </AppLogsContext.Provider>
  );
}
