import { createContext, useContext, useState, useEffect } from "react";
import { useNetwork } from "wagmi";

const AppLogsContext = createContext({});

export const useAppLogs = () => useContext(AppLogsContext);

const APP_LOG_STORAGE_KEY = "APP_LOG_STORAGE";

const getKey = (chainId) => `${APP_LOG_STORAGE_KEY}:${chainId}`;

export default function AppLogs({ children }) {
  const { chain } = useNetwork();
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    if (logs !== null || !!chain?.id) return;

    const initialValue = JSON.parse(
      window.localStorage.getItem(getKey(chain.id)) || "[]"
    );

    setLogs(initialValue);
  }, [logs, chain?.id]);

  const addLog = (props) => {
    if (!props) return;
    const { status, label, value, txHash } = props;
    const newLogs = [...logs, { status, label, value, txHash }];

    setLogs(newLogs);
    window.localStorage.setItem(getKey(chain.id), JSON.stringify(newLogs));
  };

  const clearLogs = () => {
    window.localStorage.setItem(getKey(chain.id), JSON.stringify([]));
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
