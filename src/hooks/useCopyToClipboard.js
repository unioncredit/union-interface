import { useRef, useEffect, useState } from "react";

const DELAY = 2000;

export default function useCopyToClipboard(delay = DELAY) {
  const timers = useRef([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const copy = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.warn("Copy failed", error);
      setCopied(false);
    }

    timers.current.push(
      setTimeout(() => {
        setCopied(false);
      }, delay)
    );
  };

  return [copied, copy];
}
