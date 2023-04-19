import { createContext, useContext, useState } from "react";

const AppReadyStateContext = createContext({});

export const useAppReadyState = () => useContext(AppReadyStateContext);

export default function AppReadyState({ children }) {
  const [appReady, setAppReady] = useState(null);

  return (
    <AppReadyStateContext.Provider value={{ appReady, setAppReady }}>
      {children}
    </AppReadyStateContext.Provider>
  );
}
