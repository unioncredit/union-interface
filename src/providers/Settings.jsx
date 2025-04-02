import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { BnStringify } from "../utils/json";

const SETTINGS_STORAGE_KEY = "union:settings";

const DEFAULT_SETTINGS = {
  showTestnets: false,
  ...JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY)),
};

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  setSettings: () => {},
  setSetting: () => {},
});

export const GASLESS_APPROVALS = "gasless-approvals";
export const PROVIDING_FILTERS = "providing-filters";
export const RECEIVING_FILTERS = "receiving-filters";
export const PROVIDING_SORT = "providing-sort";
export const RECEIVING_SORT = "receiving-sort";

export const useSettings = () => useContext(SettingsContext);

export default function Settings({ children }) {
  const { chain } = useAccount();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const setSetting = (key, value) => {
    setSettings((x) => ({ ...x, [key]: value }));
  };

  const settingsSting = BnStringify(settings);

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, settingsSting);
  }, [settingsSting]);

  useEffect(() => {
    // If the user is already connected to a testnet then
    // just automatically toggle showTestnets on
    if ([84532].includes(chain?.id)) {
      setSetting("showTestnets", true);
    }
  }, [chain?.id]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}
