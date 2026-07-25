// Vitest globalSetup for on-chain integration tests.
// Boots an Anvil (Foundry) instance that forks Base, so tests run against real
// deployed contract state deterministically, then tears it down.
import { spawn } from "node:child_process";

const RPC = "http://127.0.0.1:8545";
const FORK_URL = process.env.FORK_RPC_URL || "https://base-rpc.publicnode.com";

async function rpcReady(tries = 120) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(RPC, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
      });
      if (r.ok) {
        const j = await r.json();
        if (j.result) return true;
      }
    } catch {
      /* not up yet */
    }
    await new Promise((res) => setTimeout(res, 500));
  }
  return false;
}

export default async function setup() {
  const args = ["--fork-url", FORK_URL, "--port", "8545", "--silent"];
  // Pin a block for full determinism in CI (requires an archive fork URL).
  if (process.env.FORK_BLOCK_NUMBER) args.push("--fork-block-number", process.env.FORK_BLOCK_NUMBER);

  const anvil = spawn("anvil", args, { stdio: "ignore" });
  let spawnErr = null;
  anvil.on("error", (e) => {
    spawnErr = e;
  });

  const ready = await rpcReady();
  if (!ready) {
    anvil.kill("SIGKILL");
    throw new Error(
      spawnErr
        ? `Failed to start anvil (is Foundry installed? https://getfoundry.sh): ${spawnErr.message}`
        : `anvil did not become ready — check FORK_RPC_URL (${FORK_URL})`
    );
  }

  return async () => {
    anvil.kill("SIGTERM");
  };
}
