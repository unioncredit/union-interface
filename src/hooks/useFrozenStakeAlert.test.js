import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useFrozenStake = vi.hoisted(() => vi.fn());
const useSettings = vi.hoisted(() => vi.fn());
const useAccount = vi.hoisted(() => vi.fn());

vi.mock("hooks/useFrozenStake", () => ({ useFrozenStake }));
vi.mock("wagmi", () => ({ useAccount }));
vi.mock("providers/Settings", () => ({
  useSettings,
  DISMISSED_OVERDUE: "dismissed-overdue",
}));

import { useFrozenStakeAlert } from "hooks/useFrozenStakeAlert";

const A = "0xAaAaAaAa00000000000000000000000000000001";
const B = "0xBbBbBbBb00000000000000000000000000000002";

const setup = ({ overdue = [A], frozen = 100n, dismissed, setSetting = vi.fn() } = {}) => {
  useAccount.mockReturnValue({ chain: { id: 8453 } });
  useFrozenStake.mockReturnValue({
    overdueVouchees: overdue.map((address) => ({ address })),
    count: overdue.length,
    frozen,
    hasFrozenStake: overdue.length > 0 && frozen > 0n,
  });
  useSettings.mockReturnValue({
    settings: dismissed ? { "dismissed-overdue": dismissed } : {},
    setSetting,
  });
  return setSetting;
};

const render = () => renderHook(() => useFrozenStakeAlert()).result.current;

describe("useFrozenStakeAlert", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is visible when stake is frozen and nothing has been dismissed", () => {
    setup();
    expect(render().visible).toBe(true);
  });

  it("hides once the current overdue contacts have been dismissed", () => {
    setup({ overdue: [A], dismissed: { 8453: [A.toLowerCase()] } });
    expect(render().visible).toBe(false);
  });

  // The whole point of the alert is reach — a permanent dismissal would
  // silence it forever, so a newly overdue contact has to bring it back.
  it("returns when a new contact goes overdue after a dismissal", () => {
    setup({ overdue: [A, B], dismissed: { 8453: [A.toLowerCase()] } });
    expect(render().visible).toBe(true);
  });

  it("stays hidden when an acknowledged contact repays and leaves the set", () => {
    setup({ overdue: [A], dismissed: { 8453: [A.toLowerCase(), B.toLowerCase()] } });
    expect(render().visible).toBe(false);
  });

  it("keeps dismissals per chain", () => {
    setup({ overdue: [A], dismissed: { 10: [A.toLowerCase()] } });
    expect(render().visible).toBe(true);
  });

  it("records the acknowledged contacts (lowercased) without dropping other chains", () => {
    const setSetting = setup({
      overdue: [A, B],
      dismissed: { 10: ["0xold"] },
    });

    render().dismiss();

    expect(setSetting).toHaveBeenCalledWith("dismissed-overdue", {
      10: ["0xold"],
      8453: [A.toLowerCase(), B.toLowerCase()],
    });
  });

  it("never shows when no stake is actually frozen", () => {
    setup({ overdue: [A], frozen: 0n });
    expect(render().visible).toBe(false);
  });
});
