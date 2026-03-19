import { defineConfig, devices } from "@playwright/test";

const ROOT_DIR = __dirname;
const NODE_BIN_DIR = `${process.env.HOME}/.nvm/versions/node/v20.20.0/bin`;
const NODE20_PREFIX = `export PATH="${NODE_BIN_DIR}:$PATH"`;
const E2E_APP_URL = "http://127.0.0.1:3100";
const E2E_API_URL = "http://127.0.0.1:3101";
const E2E_DATABASE_URL = resolveE2EDatabaseUrl();
const E2E_DB_ENV = `DATABASE_URL="${E2E_DATABASE_URL}"`;

function resolveE2EDatabaseUrl(): string {
  if (process.env.E2E_DATABASE_URL) {
    return process.env.E2E_DATABASE_URL;
  }

  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      const databaseName = url.pathname.replace(/^\/+/, "") || "gosupportme";
      url.pathname = `/${databaseName}_e2e`;
      return url.toString();
    } catch {
      return process.env.DATABASE_URL;
    }
  }

  return "postgresql://postgres:postgres@localhost:5432/gosupportme_e2e";
}

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
      command: `${NODE20_PREFIX} && ${E2E_DB_ENV} npm run db:reset && ${E2E_DB_ENV} npm run db:seed && cd apps/api && ${E2E_DB_ENV} PORT=3101 HOST=127.0.0.1 CORS_ORIGIN=${E2E_APP_URL} NEXT_PUBLIC_APP_URL=${E2E_APP_URL} npx ts-node-dev --respawn --transpile-only src/index.ts`,
      cwd: ROOT_DIR,
      url: `${E2E_API_URL}/health`,
      reuseExistingServer: false,
      stdout: "pipe",
      stderr: "pipe",
      timeout: 180_000,
    },
    {
      command: `${NODE20_PREFIX} && cd apps/web && NEXT_DIST_DIR=.next-e2e NEXT_PUBLIC_APP_URL=${E2E_APP_URL} API_ORIGIN=${E2E_API_URL} npx next dev -p 3100`,
      cwd: ROOT_DIR,
      url: `${E2E_APP_URL}/sign-in`,
      reuseExistingServer: false,
      stdout: "pipe",
      stderr: "pipe",
      timeout: 180_000,
    },
  ],
});
