import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    alias: {
      "@gosupportme/contracts": path.resolve(__dirname, "../../packages/contracts/src/index.ts"),
    },
  },
  resolve: {
    alias: {
      "@gosupportme/contracts": path.resolve(__dirname, "../../packages/contracts/src/index.ts"),
    },
  },
});
