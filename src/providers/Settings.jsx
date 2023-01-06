import { createContext, useContext, useState } from "react";

const DEFAULT_SETTINGS = { showTestnets: false };

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  setSettings: () => {},
  setSetting: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export default function Settings({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const setSetting = (key, value) => {
    setSettings((x) => ({ ...x, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}
