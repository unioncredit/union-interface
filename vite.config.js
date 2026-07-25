/// <reference types="vitest" />
import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// Migrated from Create React App. Env vars keep their REACT_APP_ prefix
// (see envPrefix) so nothing in .env or the Vercel dashboard has to change.
export default defineConfig({
  plugins: [
    react(),
    // Enables `import X from "./x.svg?react"` (the CRA ReactComponent equivalent).
    svgr(),
    // Web3 stack (walletconnect / metamask sdk / etc.) expects Node globals.
    nodePolyfills({
      // The app imports its own src/constants.js via the bare specifier "constants"
      // (CRA baseUrl), which collides with the Node builtin. Don't shim it — let the
      // resolve.alias below win.
      exclude: ["constants"],
      globals: { Buffer: true, global: true, process: true },
      protocolImports: true,
    }),
  ],
  // Expose REACT_APP_* to import.meta.env (default is only VITE_*).
  envPrefix: "REACT_APP_",
  resolve: {
    // Replicate CRA's jsconfig baseUrl: "src" absolute imports.
    alias: {
      constants: resolve(__dirname, "src/constants.js"),
      abis: resolve(__dirname, "src/abis"),
      components: resolve(__dirname, "src/components"),
      config: resolve(__dirname, "src/config"),
      fetchers: resolve(__dirname, "src/fetchers"),
      hooks: resolve(__dirname, "src/hooks"),
      images: resolve(__dirname, "src/images"),
      pages: resolve(__dirname, "src/pages"),
      providers: resolve(__dirname, "src/providers"),
      utils: resolve(__dirname, "src/utils"),
    },
  },
  server: { port: 3000 },
  preview: { port: 3000 },
  // Keep CRA's output directory so existing tooling/gitignore still apply.
  build: { outDir: "build" },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
