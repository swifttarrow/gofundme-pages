import { defineConfig, devices } from "@playwright/test";

const ROOT_DIR = __dirname;
const NODE_BIN_DIR = `${process.env.HOME}/.nvm/versions/node/v20.20.0/bin`;
const NODE20_PREFIX = `export PATH="${NODE_BIN_DIR}:$PATH"`;
const E2E_APP_URL = "http://127.0.0.1:3100";
const E2E_API_URL = "http://127.0.0.1:3101";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: E2E_APP_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: [
    {
      command: `${NODE20_PREFIX} && npm run db:reset && npm run db:seed && cd apps/api && PORT=3101 HOST=127.0.0.1 CORS_ORIGIN=${E2E_APP_URL} NEXT_PUBLIC_APP_URL=${E2E_APP_URL} npx ts-node-dev --respawn --transpile-only src/index.ts`,
      cwd: ROOT_DIR,
      url: `${E2E_API_URL}/health`,
      reuseExistingServer: false,
      stdout: "pipe",
      stderr: "pipe",
      timeout: 180_000,
    },
    {
      command: `${NODE20_PREFIX} && cd apps/web && NEXT_DIST_DIR=.next-e2e NEXT_PUBLIC_APP_URL=${E2E_APP_URL} NEXT_PUBLIC_API_URL=${E2E_API_URL} npx next dev -p 3100`,
      cwd: ROOT_DIR,
      url: `${E2E_APP_URL}/sign-in`,
      reuseExistingServer: false,
      stdout: "pipe",
      stderr: "pipe",
      timeout: 180_000,
    },
  ],
});
