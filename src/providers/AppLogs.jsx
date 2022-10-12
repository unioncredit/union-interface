import { createContext, useContext, useState } from "react";

const AppLogsContext = createContext({});

export const useAppLogs = () => useContext(AppLogsContext);

export default function AppLogs({ children }) {
  const [logs, setLogs] = useState();

  const addLog = (props) => {
    if (!props) return;
    const { status, label, value, txHash } = props;
    setLogs((x) => [...x, { status, label, value, txHash }]);
  };

  const appLogsCtx = {
    logs,
    addLog,
  };

  return (
    <AppLogsContext.Provider value={appLogsCtx}>
      {children}
    </AppLogsContext.Provider>
  );
}
