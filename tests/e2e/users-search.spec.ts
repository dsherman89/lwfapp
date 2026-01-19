import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test("search finds a wrestler", async ({ page }) => {
  await login(page, "admin", "password123");
  await page.goto("/admin/users");

  await page.getByPlaceholder("Search by wrestler name...").fill("Zak Wayne");
  await page.getByRole("button", { name: "Apply" }).click();

  await expect(page.getByText("Zak Wayne")).toBeVisible();
});
