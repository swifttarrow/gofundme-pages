import { expect, test } from "@playwright/test";
import {
  dismissCelebrationIfPresent,
  seededFundraisers,
  seededUsers,
  signIn,
} from "./helpers";

test("signed-in donors can follow and donate from a fundraiser page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page, seededUsers.michael);

  await page.goto(`/fundraiser/${seededFundraisers.martinezFamily.id}`);

  await expect(
    page.getByRole("heading", { name: seededFundraisers.martinezFamily.title })
  ).toBeVisible();
  const donateButton = page.getByRole("button", { name: "Donate now" }).first();
  const donationModule = donateButton.locator("xpath=ancestor::div[contains(@class,'shadow-sm')][1]");
  const followButton = donationModule.getByRole("button", { name: /Follow|Following/ });

  await expect(donationModule.getByRole("progressbar", { name: "Fundraiser progress" })).toHaveAttribute(
    "aria-valuenow",
    "57"
  );
  await expect(donationModule.getByText("847 donations")).toBeVisible();

  await expect(followButton).toBeVisible();
  const initialFollowLabel = (await followButton.textContent())?.trim();

  if (initialFollowLabel === "Following") {
    await followButton.click();
    await expect(followButton).toHaveText("Follow");
    await followButton.click();
    await dismissCelebrationIfPresent(page);
    await expect(followButton).toHaveText("Following");
  } else {
    await followButton.click();
    await dismissCelebrationIfPresent(page);
    await expect(followButton).toHaveText("Following");
  }

  await donateButton.click();
  await expect(
    page.getByRole("dialog", { name: `Donate to ${seededFundraisers.martinezFamily.title}` })
  ).toBeVisible();

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("button", { name: "Donate $55" })).toBeVisible();
  await page.getByRole("button", { name: "Donate $55" }).click();

  await dismissCelebrationIfPresent(page);
  await expect(page.getByText("Donation sent")).toBeVisible();
  await expect(page.getByText("Your donation of $50 was submitted successfully.")).toBeVisible();
  await expect(donationModule.getByText("848 donations")).toBeVisible();
  await expect(donationModule.getByText("$29k")).toBeVisible();
});
