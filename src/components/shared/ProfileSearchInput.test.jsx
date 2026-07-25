import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProfileSearchInput } from "components/shared/ProfileSearchInput";

// Regression test for the "profile search crashes on any unsupported network" bug.
// In wagmi v2, useAccount().chain is `undefined` whenever the wallet is on a chain
// that isn't in the app config (isConnected stays true). The result link built the
// network tag with `EIP3770[chain.id]`, which threw on `undefined.id`.

// Hoisted so the (hoisted) vi.mock factories below can read it.
const h = vi.hoisted(() => ({
  chain: undefined,
  result: {
    name: "Alice",
    username: "alice.eth",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    avatar: "https://example.com/a.png",
  },
}));

vi.mock("wagmi", () => ({
  useAccount: () => ({ chain: h.chain }),
}));

vi.mock("hooks/useUserSearch", () => ({
  useUserSearch: () => ({ data: [h.result], isLoading: false }),
}));

// Keep EIP3770 identical to src/constants.js without pulling the provider graph.
vi.mock("constants", () => ({
  EIP3770: { 1: "eth", 42161: "arb1", 10: "opt", 8453: "base", 84532: "basesep" },
}));

// Light stubs for the design-system pieces.
vi.mock("@unioncredit/ui", () => ({ SearchIcon: () => <span data-testid="search-icon" /> }));
vi.mock("components/ui/Input", async () => {
  const { forwardRef } = await import("react");
  return {
    Input: forwardRef(({ onChange, value }, ref) => (
      <input ref={ref} aria-label="search" value={value ?? ""} onChange={onChange} />
    )),
  };
});

function renderAndSearch() {
  render(
    <MemoryRouter>
      <ProfileSearchInput />
    </MemoryRouter>
  );
  // Open the search box, then type a query so the results popover renders.
  fireEvent.click(screen.getByRole("button"));
  fireEvent.change(screen.getByLabelText("search"), { target: { value: "alice" } });
}

afterEach(() => {
  h.chain = undefined;
  vi.clearAllMocks();
});

describe("ProfileSearchInput", () => {
  it("does not crash and falls back to `base` on an unsupported network (chain is undefined)", () => {
    h.chain = undefined; // wallet on an unconfigured network
    expect(() => renderAndSearch()).not.toThrow();
    expect(screen.getByRole("link")).toHaveAttribute("href", `/profile/base:${h.result.address}`);
  });

  it("uses the EIP-3770 tag for a supported network", () => {
    h.chain = { id: 10 }; // optimism
    renderAndSearch();
    expect(screen.getByRole("link")).toHaveAttribute("href", `/profile/opt:${h.result.address}`);
  });

  it("falls back to `base` for a connected but unmapped chain id", () => {
    h.chain = { id: 137 }; // polygon: defined chain, absent from EIP3770
    renderAndSearch();
    expect(screen.getByRole("link")).toHaveAttribute("href", `/profile/base:${h.result.address}`);
  });
});
