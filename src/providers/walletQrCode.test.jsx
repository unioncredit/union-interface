import { render } from "@testing-library/react";
import { Cuer } from "cuer";
import { create } from "cuer/QrCode";
import { describe, expect, it } from "vitest";

// RainbowKit draws its wallet QR codes (shown when you pick Rainbow, MetaMask,
// WalletConnect, … without that browser extension installed) with `cuer`, which
// encodes them via `qr`. cuer@0.0.3, pinned by RainbowKit 2.2.11, asks qr for
// `border: 0`; qr >= 0.6 rejects that with "invalid border=0", which threw inside
// the connect modal and dropped the whole app onto the error page. package.json
// resolves cuer to 0.0.4 (adds qr@0.6 support). These fail if a lock refresh ever
// pairs incompatible cuer / qr versions again.
const WALLETCONNECT_URI = `wc:${"a".repeat(64)}@2?relay-protocol=irn&symKey=${"b".repeat(64)}`;

describe("wallet connect QR code", () => {
  it("renders the cuer QR code RainbowKit shows for a WalletConnect URI", () => {
    const { container } = render(<Cuer value={WALLETCONNECT_URI} />);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("encodes the bare QR symbol without a quiet-zone border", () => {
    // 5 bytes fit QR version 1, which is 21×21 modules at the default "medium" ECC.
    expect(create("hello").edgeLength).toBe(21);
  });
});
