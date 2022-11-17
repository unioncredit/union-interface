import { createContext, useContext, useState } from "react";

const CacheContext = createContext({});

export const useCache = () => useContext(CacheContext);

export default function Cache({ children }) {
  const [cacheItems, setCache] = useState({});

  const cache = (key, value) => {
    setCache((c) => ({ ...c, [key]: value }));
  };

  const cached = (key) => {
    return cacheItems[key];
  };

  return (
    <CacheContext.Provider value={{ cache, cached }}>
      {children}
    </CacheContext.Provider>
  );
}
