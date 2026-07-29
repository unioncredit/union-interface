// True when the app is already running as an installed PWA (launched from the
// home screen / dock) — in that case every "Install App" prompt is noise and
// callers should hide theirs.
export const isStandalone = () =>
  Boolean(
    typeof window !== "undefined" &&
      (window.matchMedia?.("(display-mode: standalone)")?.matches ||
        // iOS Safari's non-standard flag
        window.navigator.standalone === true)
  );
