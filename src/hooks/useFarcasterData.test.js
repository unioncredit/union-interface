import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useNeynarUser = vi.hoisted(() => vi.fn());
vi.mock("hooks/useNeynarUser", () => ({ useNeynarUser }));

import { useFarcasterData } from "hooks/useFarcasterData";

const ADDRESS = "0xb8150a1B6945e75D05769D685b127b41E6335Bbc";

const render = () => renderHook(() => useFarcasterData({ address: ADDRESS })).result.current;

describe("useFarcasterData", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps a Neynar user to the { name, bio } shape callers expect", () => {
    useNeynarUser.mockReturnValue({
      data: { username: "kingjacob", profile: { bio: { text: "building union" } } },
      isFetching: false,
      error: null,
    });

    expect(render().data).toEqual({ name: "kingjacob", bio: "building union" });
  });

  it("prefers the fname over display_name, matching the old Airstack profileName", () => {
    useNeynarUser.mockReturnValue({
      data: { username: "kingjacob", display_name: "Jacob S", profile: {} },
      isFetching: false,
      error: null,
    });

    expect(render().data.name).toBe("kingjacob");
  });

  // useNeynarUser seeds react-query with a placeholder user whose username is
  // "" and which carries no `profile`. That must read as "no Farcaster name"
  // so usePrimaryName falls through to ENS rather than rendering an empty label.
  it("normalises the empty placeholder user to nulls", () => {
    useNeynarUser.mockReturnValue({
      data: { username: "", display_name: "" },
      isFetching: true,
      error: null,
    });

    const { data, loading } = render();
    expect(data).toEqual({ name: null, bio: null });
    expect(loading).toBe(true);
  });

  it("survives a failed lookup without throwing", () => {
    useNeynarUser.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: new Error("network"),
    });

    const { data, error } = render();
    expect(data).toEqual({ name: null, bio: null });
    expect(error).toBeInstanceOf(Error);
  });
});
