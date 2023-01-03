import { createContext, useContext, useState } from "react";

const VersionContext = createContext({});

export const useVersion = () => useContext(VersionContext);

export const Versions = {
  V1: "v1",
  V2: "v2",
};

const DEFAULT_VERSION = Versions.V2;

export default function Version({ children }) {
  const [version, setVersionState] = useState(DEFAULT_VERSION);

  const setVersion = (v) => {
    if (v === 1) {
      setVersionState(Versions.V1);
    } else {
      setVersionState(Versions.V2);
    }
  };

  return (
    <VersionContext.Provider value={{ version, setVersion }}>
      {children}
    </VersionContext.Provider>
  );
}
