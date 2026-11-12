// Galería de logos de terceros en /icons/logos/ (docs-site, «Galería de iconos», escenario «Elegir un logo»).
import { expect, type Page, test } from "@playwright/test";

async function ready(page: Page) {
	await page.goto("/icons/logos/");
	await expect(
		page.locator("astro-island").filter({ has: page.locator("#logo-search") }),
	).not.toHaveAttribute("ssr", /.*/);
}

test("están los 332 SVG: 232 de apps, 16 integraciones y 34 redes, con su recuento", async ({ page }) => {
	await ready(page);
	await expect(page.locator("[data-logo]")).toHaveCount(232 + 16 + 34);
	await expect(page.locator("#logo-count")).toHaveText("282 logos");
	await page.getByRole("group", { name: "Set de logos" }).getByRole("button", { name: "Redes" }).click();
	await expect(page.locator("#logo-count")).toHaveText("34 de 282");
});

test("buscar «github» y elegir el social: el panel enseña color y gris y su import de @jotis-me/icons/logos", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await ready(page);
	await page.getByLabel("Buscar logo").fill("github");
	const visible = await page
		.locator("[data-logo]:not([hidden])")
		.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.logo as string).sort());
	expect(visible).toEqual(["app/github", "integration/github", "social/github"]);
	await page.locator('[data-logo="social/github"] button').click();
	const panel = page.getByRole("complementary", { name: "Logo elegido" });
	await expect(panel.locator("#logo-detail-name")).toHaveText("github");
	await expect(panel.getByText("Color", { exact: true })).toBeVisible();
	await expect(panel.getByText("Gris", { exact: true })).toBeVisible();
	await expect(panel).toContainText("SocialGithubLogoGray");
	const code = panel.getByRole("tabpanel");
	await expect(code).toContainText('import { SocialGithubLogo } from "@jotis-me/icons/logos";');
	await panel.getByRole("tab", { name: "Importar SVG" }).click();
	await expect(code).toContainText('from "@jotis-me/icons/logos/social/github.svg?raw"');
	await panel.getByRole("tab", { name: "SVG", exact: true }).click();
	await expect(code).toContainText('viewBox="416 16 24 24"');
});

test("los logos se cargan como imágenes, no como código de la isla, y el gris de un color sigue el tema", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await ready(page);
	const img = page.locator(`[data-logo="app/zapier"] img`);
	await expect(img).toHaveAttribute("src", /\.svg$/);
	await page.locator('[data-logo="social/github"] button').click();
	const gray = page.getByRole("complementary", { name: "Logo elegido" }).locator("span.bg-fg-primary");
	await expect(gray).toHaveCSS("mask-image", /github-gray.*\.svg/);
});

test("el selector lleva de iconos a logos y marca la página actual", async ({ page }) => {
	await page.goto("/icons/");
	const nav = page.getByRole("navigation", { name: "Iconos y recursos" });
	await expect(nav.getByRole("link", { name: "Iconos" })).toHaveAttribute("aria-current", "page");
	await nav.getByRole("link", { name: "Logos" }).click();
	await expect(page).toHaveURL(/\/icons\/logos\/$/);
	await expect(
		page.getByRole("navigation", { name: "Iconos y recursos" }).getByRole("link", { name: "Logos" }),
	).toHaveAttribute("aria-current", "page");
});
