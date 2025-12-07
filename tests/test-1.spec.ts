import { test, expect } from '@playwright/test';
import dotenv from "dotenv"




// TODO: run headless
test('test', async ({ page }) => {
  dotenv.config();

  // console.log(process.env);

  const username = process.env.MT_USERNAME ? process.env.MT_USERNAME : "";
  const password = process.env.MT_PASSWORD ? process.env.MT_PASSWORD : "";


  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill(username);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("checkbox", { name: "Remember" }).check();
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByRole("heading", { name: "Admin Dashboard" })
  ).toBeVisible();
  // TODO: close the window
});

