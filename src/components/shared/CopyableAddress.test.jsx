import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyableAddress } from "components/shared/CopyableAddress";

const ADDRESS = "0x57bd0eEcE6a0B5b8f2fc0E2d0E5aA51e34E44EFb";

describe("CopyableAddress", () => {
  let writeText;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue();
    Object.assign(navigator, { clipboard: { writeText } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the truncated address", () => {
    render(<CopyableAddress address={ADDRESS} />);
    expect(screen.getByText("0x57bd...4EFb")).toBeInTheDocument();
  });

  it("copies the FULL address on click and shows the Copied! feedback", async () => {
    render(<CopyableAddress address={ADDRESS} />);

    fireEvent.click(screen.getByText("0x57bd...4EFb"));

    expect(writeText).toHaveBeenCalledWith(ADDRESS);
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });

  it("does not trigger a parent's click handler (rows navigate/open modals)", () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <CopyableAddress address={ADDRESS} />
      </div>
    );

    fireEvent.click(screen.getByText("0x57bd...4EFb"));

    expect(parentClick).not.toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith(ADDRESS);
  });
});
