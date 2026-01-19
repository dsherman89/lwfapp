import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test("admin can login and see dashboard", async ({ page }) => {
  await login(page, "admin", "password123");
  await expect(page).toHaveURL(/\/admin/);
  await expect(page.getByText("Admin Dashboard")).toBeVisible();
});

test("admin can open user administration page", async ({ page }) => {
  await login(page, "admin", "password123");
  await page.goto("/admin/users");
  await expect(page.getByText("User administration")).toBeVisible();
  await expect(page.getByText("Wrestlers")).toBeVisible();
});
