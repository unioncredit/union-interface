// On-chain integration test — runs against a Base fork (Anvil, started by
// test/integration/anvil.global.js). Demonstrates the automated web3 pattern:
//   1. read real deployed contract state on a fork
//   2. "connect" a wallet with NO browser extension via wagmi's mock connector
//   3. sign & mine a real write, then assert the state change
//
// DETERMINISM: assertions deliberately avoid *mutable* live state (e.g. "is
// address X currently a member"), which would turn an unrelated on-chain change
// into a red CI. Instead they assert values fixed at deploy/init — the protocol's
// wired token addresses — which doubles as a check that the app's contract config
// still matches on-chain reality (catches config drift) — plus a write whose
// expected value the test itself sets.
//
// Extend this to full app flows (borrow / repay / stake / trust) by seeding
// preconditions with a viem test client (impersonate, setBalance) and calling
// the same contract methods the hooks use.
import { describe, it, expect } from "vitest";
import { createPublicClient, createWalletClient, http, getAddress, zeroAddress } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { createConfig, connect, readContract } from "@wagmi/core";
import { mock } from "wagmi/connectors";

// Use the app's real contract config so the test tracks production wiring.
import { userManagerContract, uTokenContract, usdcContract } from "config/contracts/v2/base";

const ANVIL = "http://127.0.0.1:8545";

// Anvil's default account #0 — a well-known dev key, safe (local fork only).
const TEST_ACCOUNT = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

const publicClient = createPublicClient({ chain: base, transport: http(ANVIL) });

describe("Union on-chain integration (Base fork via Anvil)", () => {
  it("app contract config matches on-chain wiring (invariant; catches config drift)", async () => {
    const [stakingToken, uToken] = await Promise.all([
      publicClient.readContract({ ...userManagerContract, functionName: "stakingToken" }),
      publicClient.readContract({ ...userManagerContract, functionName: "uToken" }),
    ]);

    // userManager's staking token must be the USDC address the app is configured with.
    expect(getAddress(stakingToken)).toBe(getAddress(usdcContract.address));
    // ...and its uToken must be the uToken the app is configured with.
    expect(getAddress(uToken)).toBe(getAddress(uTokenContract.address));
  });

  it("reads real deployed state: checkIsMember(zeroAddress) is false", async () => {
    // Exercises the same call shape the app's member lookups use, without
    // depending on any particular account's (mutable) membership status.
    const isMember = await publicClient.readContract({
      ...userManagerContract,
      functionName: "checkIsMember",
      args: [zeroAddress],
    });
    expect(isMember).toBe(false);
  });

  it("connects a wallet with no extension (wagmi mock connector) and reads", async () => {
    const config = createConfig({
      chains: [base],
      transports: { [base.id]: http(ANVIL) },
      connectors: [mock({ accounts: [TEST_ACCOUNT.address] })],
    });

    const { accounts } = await connect(config, { connector: config.connectors[0] });
    expect(getAddress(accounts[0])).toBe(getAddress(TEST_ACCOUNT.address));

    // Read through wagmi (the path the app's hooks use), asserting an invariant.
    const stakingToken = await readContract(config, {
      ...userManagerContract,
      functionName: "stakingToken",
      chainId: base.id,
    });
    expect(getAddress(stakingToken)).toBe(getAddress(usdcContract.address));
  });

  it("signs & mines a write on the fork: USDC approve updates allowance", async () => {
    const wallet = createWalletClient({
      account: TEST_ACCOUNT,
      chain: base,
      transport: http(ANVIL),
    });
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
