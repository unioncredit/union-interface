// On-chain integration test — runs against a Base fork (Anvil, started by
// test/integration/anvil.global.js). Demonstrates the automated web3 pattern:
//   1. read real deployed contract state on a fork
//   2. "connect" a wallet with NO browser extension via wagmi's mock connector
//   3. sign & mine a real write, then assert the state change
//
// Extend this to full app flows (borrow / repay / stake / trust) by seeding
// preconditions with a viem test client (impersonate, setBalance) and calling
// the same contract methods the hooks use.
import { describe, it, expect } from "vitest";
import { createPublicClient, createWalletClient, http, getAddress } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { createConfig, connect, readContract } from "@wagmi/core";
import { mock } from "wagmi/connectors";

// Use the app's real contract config so the test tracks production wiring.
import { userManagerContract, usdcContract } from "config/contracts/v2/base";

const ANVIL = "http://127.0.0.1:8545";

// kingjacob.eth — a known Union member on Base (verified on-chain).
const KNOWN_MEMBER = getAddress("0xb8150a1B6945e75D05769D685b127b41E6335Bbc");

// Anvil's default account #0 — a well-known dev key, safe (local fork only).
const TEST_ACCOUNT = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

const publicClient = createPublicClient({ chain: base, transport: http(ANVIL) });

describe("Union on-chain integration (Base fork via Anvil)", () => {
  it("reads real deployed state: checkIsMember(known member) is true", async () => {
    const isMember = await publicClient.readContract({
      ...userManagerContract,
      functionName: "checkIsMember",
      args: [KNOWN_MEMBER],
    });
    expect(isMember).toBe(true);
  });

  it("connects a wallet with no extension (wagmi mock connector) and reads", async () => {
    const config = createConfig({
      chains: [base],
      transports: { [base.id]: http(ANVIL) },
      connectors: [mock({ accounts: [TEST_ACCOUNT.address] })],
    });

    const { accounts } = await connect(config, { connector: config.connectors[0] });
    expect(getAddress(accounts[0])).toBe(getAddress(TEST_ACCOUNT.address));

    const isMember = await readContract(config, {
      ...userManagerContract,
      functionName: "checkIsMember",
      args: [KNOWN_MEMBER],
      chainId: base.id,
    });
    expect(isMember).toBe(true);
  });

  it("signs & mines a write on the fork: USDC approve updates allowance", async () => {
    const wallet = createWalletClient({ account: TEST_ACCOUNT, chain: base, transport: http(ANVIL) });
    const spender = getAddress(userManagerContract.address);
    const amount = 1_000_000n; // 1 USDC (6 decimals)

    const hash = await wallet.writeContract({
      ...usdcContract,
      functionName: "approve",
      args: [spender, amount],
    });
    await publicClient.waitForTransactionReceipt({ hash });

    const allowance = await publicClient.readContract({
      ...usdcContract,
      functionName: "allowance",
      args: [TEST_ACCOUNT.address, spender],
    });
    expect(allowance).toBe(amount);
  });
});
