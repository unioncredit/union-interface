import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { ProfileSearchInput } from "components/shared/ProfileSearchInput";

// Regression test for the "profile search crashes on any unsupported network" bug.
// In wagmi v2, useAccount().chain is `undefined` whenever the wallet is on a chain
// that isn't in the app config (isConnected stays true). The result link built the
// network tag with `EIP3770[chain.id]`, which throws on `undefined.id` and — because
// <Header/> renders outside any ErrorBoundary — white-screened the whole app.

// wagmi: drive chain from a mock-prefixed variable (jest allows out-of-scope refs
// only when the name starts with "mock").
let mockChain;
jest.mock("wagmi", () => ({
  useAccount: () => ({ chain: mockChain }),
}));

// Deterministic single search result.
const mockResult = {
  name: "Alice",
  username: "alice.eth",
  address: "0x1234567890abcdef1234567890abcdef12345678",
  avatar: "https://example.com/a.png",
};
jest.mock("hooks/useUserSearch", () => ({
  useUserSearch: () => ({ data: [mockResult], isLoading: false }),
}));

// Keep EIP3770 identical to src/constants.js without pulling the provider graph.
jest.mock("constants", () => ({
  EIP3770: { 1: "eth", 42161: "arb1", 10: "opt", 8453: "base", 84532: "basesep" },
}));

// Light stubs for the design-system pieces.
jest.mock("@unioncredit/ui", () => ({ SearchIcon: () => <span data-testid="search-icon" /> }));
jest.mock("components/ui/Input", () => {
  const React = require("react");
  return {
    Input: React.forwardRef(({ onChange, value }, ref) => (
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
  mockChain = undefined;
  jest.clearAllMocks();
});

describe("ProfileSearchInput", () => {
  it("does not crash and falls back to `base` on an unsupported network (chain is undefined)", () => {
    mockChain = undefined; // wallet on an unconfigured network
    expect(() => renderAndSearch()).not.toThrow();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/profile/base:${mockResult.address}`
    );
  });

  it("uses the EIP-3770 tag for a supported network", () => {
    mockChain = { id: 10 }; // optimism
    renderAndSearch();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/profile/opt:${mockResult.address}`
    );
  });

  it("falls back to `base` for a connected but unmapped chain id", () => {
    mockChain = { id: 137 }; // polygon: defined chain, absent from EIP3770
    renderAndSearch();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/profile/base:${mockResult.address}`
    );
  });
});
