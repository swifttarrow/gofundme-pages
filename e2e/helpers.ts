import { expect, Page } from "@playwright/test";

export const seededUsers = {
  michael: {
    id: "a1b2c3d4-0002-0002-0002-000000000002",
    email: "michael@example.com",
    password: "gosupportme-dev-password",
    name: "Michael Chen",
  },
  sarah: {
    id: "a1b2c3d4-0001-0001-0001-000000000001",
    email: "sarah@example.com",
    password: "gosupportme-dev-password",
    name: "Sarah Johnson",
  },
} as const;

export const seededFundraisers = {
  martinezFamily: {
    id: "b1b2c3d4-0001-0001-0001-000000000001",
    title: "Help the Martinez Family Rebuild After the Fire",
  },
} as const;

export async function signIn(
  page: Page,
  user: (typeof seededUsers)[keyof typeof seededUsers]
): Promise<void> {
  await page.context().clearCookies();
  await page.goto("/sign-in");

  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL("/");
}

export async function dismissCelebrationIfPresent(page: Page): Promise<void> {
  const dismissButton = page.getByRole("button", { name: "Nice" });
  await dismissButton.waitFor({ state: "visible", timeout: 1500 }).catch(() => null);
  const isVisible = await dismissButton.isVisible().catch(() => false);
  if (isVisible) {
    await dismissButton.click();
    await dismissButton.waitFor({ state: "detached", timeout: 5000 }).catch(async () => {
      await expect(dismissButton).toBeHidden();
    });
  }
}
