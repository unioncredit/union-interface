import { defineConfig } from "vitest/config";
import { resolve } from "path";

// Separate config for on-chain integration tests: they need a running Anvil
// fork (started in globalSetup) and run in the node environment. Kept out of the
// default `yarn test` (unit) run via the `.itest.js` naming.
export default defineConfig({
  resolve: {
    alias: {
      constants: resolve(__dirname, "src/constants.js"),
      abis: resolve(__dirname, "src/abis"),
      config: resolve(__dirname, "src/config"),
      utils: resolve(__dirname, "src/utils"),
      hooks: resolve(__dirname, "src/hooks"),
      providers: resolve(__dirname, "src/providers"),
    },
  },
  test: {
    include: ["test/integration/**/*.itest.js"],
    globalSetup: ["./test/integration/anvil.global.js"],
    environment: "node",
    testTimeout: 60_000,
    hookTimeout: 120_000, // Anvil fork startup can be slow on a cold cache
    fileParallelism: false,
  },
});
