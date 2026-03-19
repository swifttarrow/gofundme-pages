import { expect, test } from "@playwright/test";
import { dismissCelebrationIfPresent, seededUsers, signIn } from "./helpers";

test("organizers can browse profile tabs and edit their profile", async ({ page }) => {
  await signIn(page, seededUsers.sarah);

  await page.goto(`/profile/${seededUsers.sarah.id}`);

  await expect(page.getByRole("heading", { name: seededUsers.sarah.name })).toBeVisible();
  await expect(page.getByRole("link", { name: "Fundraisers" })).toBeVisible();
  await expect(page.getByText("Help the Martinez Family Rebuild After the Fire")).toBeVisible();
  await expect(page.getByText("Send Underserved Kids to Coding Camp")).toBeVisible();

  await page.getByRole("link", { name: "Following" }).click();
  await expect(page).toHaveURL(new RegExp(`/profile/${seededUsers.sarah.id}\\?tab=following`));
  await expect(page.getByText("Not following any organizers yet.")).toBeVisible();

  await page.getByRole("link", { name: "Donations" }).click();
  await expect(page).toHaveURL(new RegExp(`/profile/${seededUsers.sarah.id}\\?tab=donations`));
  await expect(page.getByText("No donations yet.")).toBeVisible();

  await page.getByRole("button", { name: "Edit profile" }).click();
  await expect(page.getByRole("heading", { name: "Edit profile" })).toBeVisible();

  await page.getByLabel("Name").fill("Sarah Johnson E2E");
  await page.getByLabel("Location").fill("San Francisco Bay Area");
  await page.getByLabel("Description").fill("Community organizer validating the Playwright suite.");
  await page.getByRole("button", { name: "Save" }).click();

  await dismissCelebrationIfPresent(page);
  await expect(page.getByRole("heading", { name: "Sarah Johnson E2E" })).toBeVisible();
  await expect(page.getByText("San Francisco Bay Area")).toBeVisible();
  await expect(page.getByText("Community organizer validating the Playwright suite.")).toBeVisible();
});
