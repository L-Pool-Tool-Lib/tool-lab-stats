import { test, expect } from '@playwright/test';
import { chromium } from "playwright";
import dotenv from "dotenv";

// TODO: run headless
test("test", async () => {
  dotenv.config();

  // console.log(process.env);

  let cookies = [];
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  try {
    const page = await context.newPage();

    const username = process.env.MT_USERNAME ? process.env.MT_USERNAME : "";
    const password = process.env.MT_PASSWORD ? process.env.MT_PASSWORD : "";
    const baseUrl = process.env.MT_API_URL ? process.env.MT_API_URL : "";

    await page.goto(`${baseUrl}/library/myTurnLogin/auth`);
    await page.getByRole("textbox", { name: "Username" }).click();
    await page.getByRole("textbox", { name: "Username" }).fill(username);
    await page.getByRole("textbox", { name: "Password" }).click();
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("checkbox", { name: "Remember" }).check();
    await page.getByRole("button", { name: "Login" }).click();
    await expect(
      page.getByRole("heading", { name: "Admin Dashboard" })
    ).toBeVisible();
    cookies = await context.cookies();
    console.log("Cookies after logging in:", cookies);
    // TODO: close the window
  } catch (err) {
    console.log(err);
    await browser.close();
    throw new Error();
  }
});

