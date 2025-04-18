import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { BnStringify } from "utils/json";

const AppLogsContext = createContext({});

export const useAppLogs = () => useContext(AppLogsContext);

const APP_LOG_STORAGE_KEY = "APP_LOG_STORAGE";

const getKey = (chainId) => `${APP_LOG_STORAGE_KEY}:${chainId}`;

export default function AppLogs({ children }) {
  const { chain } = useAccount();
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    if (!chain?.id) return;

    const initialValue = JSON.parse(window.localStorage.getItem(getKey(chain.id)) || "[]");

    setLogs(initialValue);
  }, [chain?.id]);

  const addLog = (props) => {
    if (!props) return;
    const { status, label, value, txHash } = props;
    const newLogs = [...logs, { status, label, value, txHash }];
    setLogs(newLogs);
    window.localStorage.setItem(getKey(chain.id), BnStringify(newLogs));
  };

  const clearLogs = () => {
    window.localStorage.setItem(getKey(chain.id), BnStringify([]));
    setLogs([]);
  };

  const appLogsCtx = {
    logs,
    addLog,
    clearLogs,
  };

  return <AppLogsContext.Provider value={appLogsCtx}>{children}</AppLogsContext.Provider>;
}
