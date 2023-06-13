import { useState } from "react";

const LABEL_STORAGE_KEY = "union:labels";

const getKey = (key) => `${LABEL_STORAGE_KEY}:${key}`;

export default function useLabels() {
  const [, rerender] = useState(0);

  const setLabel = (key, label) => {
    window.localStorage.setItem(getKey(key), label);
    rerender((x) => x + 1);
  };

  const getLabel = (key) => {
    return window.localStorage.getItem(getKey(key));
  };

  const removeLabel = (key) => {
    return window.localStorage.removeItem(getKey(key));
  };

  return { getLabel, setLabel, removeLabel };
}
