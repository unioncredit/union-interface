import { useState, useEffect } from "react";

export default function useScrollLock() {
  const [scrollLock, setScrollLock] = useState(false);

  useEffect(() => {
    document.body.style.overflow = scrollLock ? "hidden" : "scroll";
  }, [scrollLock]);

  return setScrollLock;
}
