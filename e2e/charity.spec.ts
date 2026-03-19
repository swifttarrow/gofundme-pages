import { expect, test } from "@playwright/test";
import { seededUsers, signIn } from "./helpers";

test("eligible users can submit a charity request and then see the blocked/status states", async ({
  page,
}) => {
  await signIn(page, seededUsers.michael);

  await page.goto("/");
  await page.getByRole("button", { name: "Open create menu" }).click();
  await page.getByRole("link", { name: "Create charity" }).click();

  await expect(page).toHaveURL(/\/charity\/new/);
  await expect(
    page.getByRole("heading", { name: "We help you get your charity started" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Submit your charity request" })
  ).toBeVisible();

  await page.getByLabel("Charity name *").fill("Neighbors Relief Collective");
  await page.getByLabel("Mission / purpose *").fill(
    "We provide emergency grocery and rent support for families recovering from layoffs."
  );
  await page.getByLabel("Who or what will be helped *").fill(
    "Families in Oakland who need short-term stability support."
  );
  await page.getByLabel("How funds will be used *").fill(
    "Funds cover groceries, utility bills, and short-term rent assistance."
  );
  await page.getByLabel("Location *").fill("Oakland, CA");
  await page
    .getByLabel("Cover image URL")
    .fill("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop");
  await page.getByRole("button", { name: "Submit for review" }).click();

  await expect(
    page.getByRole("heading", { name: "Your charity request is under review" })
  ).toBeVisible();

  await page.goto("/charity/new");
  await expect(page.getByRole("heading", { name: "Request already in progress" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View your charity request" })).toBeVisible();

  await page.goto(`/profile/${seededUsers.michael.id}`);
  await expect(page.getByText("Your Charity Request")).toBeVisible();
  await page.getByRole("link", { name: "View request status" }).click();

  await expect(page).toHaveURL("/charity/request");
  await expect(page.getByRole("heading", { name: "Your Charity Request" })).toBeVisible();
  await expect(page.getByText("under review")).toBeVisible();
  await expect(page.getByText("Neighbors Relief Collective")).toBeVisible();
});

test("charity request status is scoped to the signed-in user", async ({ page }) => {
  await signIn(page, seededUsers.michael);
  await page.goto("/charity/new");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Charity name *").fill("Michael's Request");
  await page.getByLabel("Mission / purpose *").fill(
    "We provide emergency shelter and meals for families displaced by local disasters."
  );
  await page.getByLabel("Who or what will be helped *").fill(
    "Families in the East Bay who need immediate housing support."
  );
  await page.getByLabel("How funds will be used *").fill(
    "Funds cover motel stays, transportation, groceries, and immediate essentials."
  );
  await page.getByLabel("Location *").fill("Oakland, CA");
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText("Michael's Request")).toBeVisible();

  await signIn(page, seededUsers.sarah);
  await page.goto("/charity/request");

  await expect(page.getByRole("heading", { name: "Your Charity Request" })).toBeVisible();
  await expect(page.getByText("Michael's Request")).toHaveCount(0);
  await expect(page.getByText("We couldn't load your request.")).toBeVisible();
});
