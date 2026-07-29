import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useVouchees = vi.hoisted(() => vi.fn());
vi.mock("providers/VoucheesData", () => ({ useVouchees }));

import { useFrozenStake } from "hooks/useFrozenStake";

const vouchee = (address, isOverdue, locking) => ({ address, isOverdue, locking });

const render = () => renderHook(() => useFrozenStake()).result.current;

describe("useFrozenStake", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sums locked stake across overdue contacts only", () => {
    useVouchees.mockReturnValue({
      data: [
        vouchee("0xa", true, 100n),
        vouchee("0xb", false, 900n),
        vouchee("0xc", true, 25n),
      ],
    });

    const { count, frozen, hasFrozenStake, overdueVouchees } = render();
    expect(count).toBe(2);
    expect(frozen).toBe(125n);
    expect(hasFrozenStake).toBe(true);
    expect(overdueVouchees.map((v) => v.address)).toEqual(["0xa", "0xc"]);
  });

  it("stays quiet when nobody is overdue", () => {
    useVouchees.mockReturnValue({ data: [vouchee("0xa", false, 500n)] });

    const { count, frozen, hasFrozenStake } = render();
    expect(count).toBe(0);
    expect(frozen).toBe(0n);
    expect(hasFrozenStake).toBe(false);
  });

  // An overdue contact who has borrowed nothing against THIS member's vouch
  // freezes none of their capital — alerting there would be a false alarm.
  it("does not flag frozen stake when overdue contacts lock nothing", () => {
    useVouchees.mockReturnValue({ data: [vouchee("0xa", true, 0n)] });

    const { count, frozen, hasFrozenStake } = render();
    expect(count).toBe(1);
    expect(frozen).toBe(0n);
    expect(hasFrozenStake).toBe(false);
  });

  it("tolerates a missing locking field and an empty list", () => {
    useVouchees.mockReturnValue({ data: [{ address: "0xa", isOverdue: true }] });
    expect(render().frozen).toBe(0n);

    useVouchees.mockReturnValue({ data: undefined });
    expect(render().hasFrozenStake).toBe(false);
  });
});
