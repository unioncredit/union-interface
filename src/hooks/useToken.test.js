import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { arbitrum } from "wagmi/chains";

const useAccount = vi.hoisted(() => vi.fn(() => ({ chain: undefined })));
vi.mock("wagmi", () => ({ useAccount }));

import { TOKENS } from "constants";
import { protocolNetworks, testNetworkIds } from "config/networks";
import { useToken } from "hooks/useToken";

const tokenFor = (chainId) => renderHook(() => useToken(chainId)).result.current.token;

describe("useToken", () => {
  // #401: the data providers call token.toLowerCase(), so a network without a token
  // took the whole app down to the error page.
  it("has a token for every network the Protocol page offers", () => {
    for (const { chainId, labelWithVersion } of protocolNetworks) {
      expect(tokenFor(chainId), labelWithVersion).not.toBeNull();
    }
  });

  it("maps Arbitrum (Union v1) to DAI", () => {
    expect(tokenFor(arbitrum.id)).toBe(TOKENS.DAI);
  });
});

describe("protocolNetworks", () => {
  it("leaves out testnets", () => {
    const chainIds = protocolNetworks.map((n) => n.chainId);

    for (const testnet of testNetworkIds) {
      expect(chainIds).not.toContain(testnet);
    }
  });
});
