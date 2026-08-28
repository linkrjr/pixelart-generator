import { expect, test } from "@playwright/test";

test("generates a pixel-art image from a description", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "PixelArt Generator" }),
  ).toBeVisible();

  const generate = page.getByRole("button", { name: "Generate" });
  await expect(generate).toBeDisabled();

  await page.getByLabel("Describe your image").fill("a small green dragon");
  await expect(generate).toBeEnabled();
  await generate.click();

  const image = page.getByRole("img", { name: "a small green dragon" });
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("src", /^data:image\/svg\+xml/);
});

test("keeps the submit button inert for an empty prompt", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Generate" })).toBeDisabled();
});

test("surfaces an error when generation fails", async ({ page }) => {
  await page.route("**/api/generate", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Could not generate an image. Try again." }),
    }),
  );

  await page.goto("/");
  await page.getByLabel("Describe your image").fill("a castle");
  await page.getByRole("button", { name: "Generate" }).click();

  await expect(
    page.getByText("Could not generate an image. Try again."),
  ).toBeVisible();
});

test("has no horizontal overflow on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
