import "./SettingToggle.scss";

import { Toggle } from "@unioncredit/ui";

import { useSettings } from "providers/Settings";

export default function SettingToggle({ label, settingKey }) {
  const { settings, setSetting } = useSettings();

  return (
    <div className="SettingToggle">
      {label}{" "}
      <div className="SettingToggle__toggle">
        <Toggle
          initialState={settings[settingKey]}
          onChange={() => {
            setSetting(settingKey, settings[settingKey] ? false : true);
          }}
        />
      </div>
    </div>
  );
}
