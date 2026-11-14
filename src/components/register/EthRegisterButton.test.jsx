import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useAccount = vi.hoisted(() => vi.fn());
const useBalance = vi.hoisted(() => vi.fn());
const useProtocol = vi.hoisted(() => vi.fn());
const useWrite = vi.hoisted(() => vi.fn());

vi.mock("wagmi", () => ({ useAccount, useBalance }));
vi.mock("providers/ProtocolData", () => ({ useProtocol }));
vi.mock("hooks/useWrite", () => ({ default: useWrite }));
vi.mock("hooks/useReferrer", () => ({ default: () => ({ referrer: null }) }));

import { EthRegisterButton } from "components/register/EthRegisterButton";

const REG_FEE = 420_000_000_000_000n; // Base RegisterHelper values at the time of #463
const REBATE = 210_000_000_000_000n;
const ONE_ETH = 10n ** 18n;

// Renders the button and returns the options it passed to useWrite.
const setup = ({ protocol, balance }) => {
  useAccount.mockReturnValue({ address: "0x99489cE62F2F0ec8ECA4b22ba1D09202d4807323" });
  useProtocol.mockReturnValue({ data: protocol });
  useBalance.mockReturnValue({ data: balance === undefined ? undefined : { value: balance } });
  useWrite.mockReturnValue({});

  render(<EthRegisterButton onComplete={vi.fn()} />);

  return useWrite.mock.calls.at(-1)[0];
};

describe("EthRegisterButton", () => {
  beforeEach(() => vi.clearAllMocks());

  // #463: with the fee still loading, the button sent `register` with no ETH and reverted.
  it("stays disabled while the registration fee is loading", () => {
    const write = setup({ protocol: undefined, balance: ONE_ETH });

    expect(write.enabled).toBe(false);
    expect(write.disabled).toBe(true);
    expect(screen.queryByText(/not have enough funds/i)).not.toBeInTheDocument();
  });

  it("stays disabled while the wallet balance is loading", () => {
    const write = setup({ protocol: { regFee: REG_FEE, rebate: REBATE }, balance: undefined });

    expect(write.enabled).toBe(false);
    expect(screen.queryByText(/not have enough funds/i)).not.toBeInTheDocument();
  });

  it("sends regFee + rebate once both are known", () => {
    const write = setup({ protocol: { regFee: REG_FEE, rebate: REBATE }, balance: ONE_ETH });

    expect(write.enabled).toBe(true);
    expect(write.value).toBe(REG_FEE + REBATE);
  });

  it("asks for more ETH when the balance is below the fee", () => {
    const write = setup({ protocol: { regFee: REG_FEE, rebate: REBATE }, balance: REG_FEE });

    expect(write.enabled).toBe(false);
    expect(screen.getByText(/not have enough funds/i)).toBeInTheDocument();
  });
});
