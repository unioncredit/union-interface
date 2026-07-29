import { afterEach, describe, expect, it, vi } from "vitest";

import { isStandalone } from "utils/isStandalone";

describe("isStandalone", () => {
  afterEach(() => {
    delete window.matchMedia;
    delete window.navigator.standalone;
    vi.restoreAllMocks();
  });

  it("is false in a plain browser tab", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    expect(isStandalone()).toBe(false);
  });

  it("is true when running in display-mode: standalone", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    expect(isStandalone()).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith("(display-mode: standalone)");
  });

  it("is true under iOS Safari's navigator.standalone flag", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    window.navigator.standalone = true;
    expect(isStandalone()).toBe(true);
  });

  // jsdom has no matchMedia at all — the same is true of some older WebViews,
  // and an install prompt must never crash the header over it.
  it("tolerates environments without matchMedia", () => {
    expect(isStandalone()).toBe(false);
  });
});
