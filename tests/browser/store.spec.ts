import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
const productPath = "/product/demo-everyday-bottle";
test("home, desktop navigation, search and filters", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Everyday essentials.",
  );
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Shop", exact: true })
    .click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.locator(".result-count")).toContainText("6 products");
  await page
    .getByRole("searchbox", { name: "Search products", exact: true })
    .fill("mug");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".product-card")).toHaveCount(6);
  await page
    .getByLabel("Category", { exact: true })
    .selectOption("Dining & crockery");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByLabel("Brand", { exact: true }).selectOption("Demo Kitchen");
  await expect(
    page.getByRole("heading", { name: "No products found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).first().click();
  await page.getByLabel("Brand", { exact: true }).selectOption("Demo Kitchen");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.reload();
  await expect(page.getByLabel("Brand", { exact: true })).toHaveValue(
    "Demo Kitchen",
  );
  await page.getByLabel("Search the collection").fill("bottle");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  expect(errors).toEqual([]);
});
test("variants, cart merging, quantity controls, persistence and enquiry links", async ({
  page,
}) => {
  await page.goto(productPath);
  const add = page.getByRole("button", { name: "Add to Cart", exact: true });
  await expect(add).toBeDisabled();
  await page.getByLabel("Sand · sample variant").check();
  await add.click();
  await page.getByRole("button", { name: "Added to Cart ✓" }).click();
  await page.getByLabel("Sage · sample variant").check();
  await page.getByRole("button", { name: "Add to Cart", exact: true }).click();
  const enquiry = new URL(
    (await page
      .getByRole("link", { name: "Ask on WhatsApp" })
      .getAttribute("href")) ?? "",
  );
  expect(enquiry.hostname).toBe("wa.me");
  expect(enquiry.searchParams.get("text")).toContain("Sage · sample variant");
  await page.getByRole("link", { name: "Cart, 3 items" }).click();
  await expect(page.locator(".cart-row")).toHaveCount(2);
  await expect(page.locator("output").first()).toHaveText("2");
  await page.getByRole("button", { name: /Increase quantity.*Sand/i }).click();
  await expect(page.locator("output").first()).toHaveText("3");
  await page.reload();
  await expect(page.locator(".cart-row")).toHaveCount(2);
  await expect(page.locator("output").first()).toHaveText("3");
  const cartUrl = new URL(
    (await page
      .getByRole("link", { name: "Send enquiry" })
      .getAttribute("href")) ?? "",
  );
  expect(cartUrl.searchParams.get("text")).toContain("Quantity: 3");
  expect(cartUrl.searchParams.get("text")).toContain("Sage");
  await page.getByRole("button", { name: /Remove.*Sand/ }).click();
  await expect(page.locator(".cart-row")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: /Decrease quantity/ }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Clear cart" }).click();
  await expect(
    page.getByRole("heading", { name: "Your cart is waiting" }),
  ).toBeVisible();
});
test("corrupt storage, missing products and broken image fallback", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("shubh-crockery-cart-v1", "{bad"),
  );
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Your cart is waiting" }),
  ).toBeVisible();
  await page.goto("/product/no-such-product");
  await expect(
    page.getByRole("heading", { name: "Product not found" }),
  ).toBeVisible();
  await page.goto("/product/demo-lunch-box");
  await expect(
    page.getByRole("img", { name: "Product image not yet available" }),
  ).toBeVisible();
  await page.route("**/images/mug.svg", (route) => route.abort());
  await page.goto("/product/demo-tea-mug");
  await expect(
    page.getByRole("img", { name: "Product image not yet available" }),
  ).toBeVisible();
});
test("all routes load directly, groups derive product counts and invalid groups show 404", async ({
  page,
}) => {
  const cases: [string, string][] = [
    ["/categories", "Categories"],
    ["/category/dining-crockery", "Dining & crockery"],
    ["/brands", "Brands"],
    ["/brand/demo-table", "Demo Table"],
    ["/about", "For the everyday"],
    ["/contact", "One message away."],
    ["/not-real", "Page not found"],
    ["/category/invalid", "Category not found"],
    ["/brand/invalid", "Brand not found"],
  ];
  for (const [path, heading] of cases) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      heading,
    );
  }
  await page.goto("/category/dining-crockery");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.goto("/brand/demo-table");
  await expect(page.locator(".product-card")).toHaveCount(2);
});
test("mobile menu keyboard controls, close on navigation and restored scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toHaveAttribute("aria-expanded", "true");
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(
    nav.getByRole("link", { name: "Shop", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    nav.getByRole("link", { name: "Contact", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(nav).toHaveCount(0);
  await toggle.click();
  await nav.getByRole("link", { name: "Shop", exact: true }).click();
  await expect(nav).toHaveCount(0);
  await expect(page).toHaveURL(/\/shop$/);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await toggle.click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(nav).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});
for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440]) {
  test(`responsive layouts have no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/shop", productPath, "/cart"]) {
      await page.goto(path);
      if (path === productPath) {
        await page.getByLabel("Sand · sample variant").check();
        await page
          .getByRole("button", { name: "Add to Cart", exact: true })
          .click();
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        path,
      ).toBe(true);
    }
  });
}
test("accessible landmarks, labels and skip navigation", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await page.goto("/shop");
  await expect(
    page.getByRole("searchbox", { name: "Search products", exact: true }),
  ).toBeVisible();
});

test("product card add updates the header and cart", async ({ page }) => {
  await page.goto("/shop");
  const card = page
    .locator(".product-card")
    .filter({ has: page.getByRole("heading", { name: "The daily tea mug" }) });
  await card.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByRole("link", { name: "Cart, 1 items" })).toBeVisible();
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "The daily tea mug" }),
  ).toBeVisible();
});

test("automated accessibility checks on core desktop and mobile pages", async ({
  page,
}) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/shop",
      "/product/demo-everyday-bottle",
      "/cart",
      "/contact",
    ]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        `${width}px ${path}`,
      ).toEqual([]);
    }
  }
});
