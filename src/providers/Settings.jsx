import { createContext, useContext, useEffect, useState } from "react";
import { BnStringify } from "../utils/json";

const SETTINGS_STORAGE_KEY = "union:settings";

const DEFAULT_SETTINGS = {
  ...JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY)),
};

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  setSettings: () => {},
  setSetting: () => {},
});

export const GASLESS_APPROVALS = "gasless-approvals";
// { [chainId]: string[] } — overdue contacts whose frozen-stake alert the
// member has dismissed. Stored per chain because vouchees are per chain.
export const DISMISSED_OVERDUE = "dismissed-overdue";
export const PROVIDING_FILTERS = "providing-filters";
export const RECEIVING_FILTERS = "receiving-filters";
export const PROVIDING_SORT = "providing-sort";
export const RECEIVING_SORT = "receiving-sort";

export const useSettings = () => useContext(SettingsContext);

export default function Settings({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const setSetting = (key, value) => {
    setSettings((x) => ({ ...x, [key]: value }));
  };

  const settingsSting = BnStringify(settings);

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, settingsSting);
  }, [settingsSting]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}
