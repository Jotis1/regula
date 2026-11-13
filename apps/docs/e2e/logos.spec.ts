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

test("buscar «github» y elegir el social: el panel enseña color y gris y su import de @jotis-me/assets/logos", async ({
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
	await expect(code).toContainText(
		'import { SocialGithubLogo, SocialGithubLogoGray } from "@jotis-me/assets/logos";',
	);
	await expect(panel.getByRole("list", { name: "Variantes" }).getByRole("listitem")).toHaveText([
		"Color",
		"Gris",
	]);
	await panel.getByRole("tab", { name: "Importar SVG" }).click();
	await expect(code).toContainText('from "@jotis-me/assets/logos/social/github.svg?raw"');
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

test("la navegación de sets lleva de iconos a logos y marca la página actual, con su recuento", async ({
	page,
}) => {
	await page.goto("/icons/");
	const nav = page.getByRole("navigation", { name: "Tipo de icono" });
	await expect(nav.getByRole("link", { name: /^De línea/ })).toHaveAttribute("aria-current", "page");
	await nav.getByRole("link", { name: /^Logos/ }).click();
	await expect(page).toHaveURL(/\/icons\/logos\/$/);
	await expect(
		page.getByRole("navigation", { name: "Tipo de icono" }).getByRole("link", { name: "Logos 282" }),
	).toHaveAttribute("aria-current", "page");
});

test("sin resultados: nombra lo buscado y «Limpiar búsqueda» devuelve los logos", async ({ page }) => {
	await ready(page);
	await page.getByLabel("Buscar logo").fill("zzzz");
	await expect(page.locator("#logo-count")).toHaveText("0 de 282");
	await expect(page.getByRole("heading", { name: "Nada con «zzzz»" })).toBeVisible();
	await page.getByRole("button", { name: "Limpiar búsqueda" }).click();
	await expect(page.locator("#logo-count")).toHaveText("282 logos");
	await expect(page.getByLabel("Buscar logo")).toBeFocused();
});

test("en móvil, tocar un logo abre la hoja inferior con el foco dentro y Escape devuelve el foco al logo", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await ready(page);
	await expect(page.getByRole("complementary", { name: "Logo elegido" })).toBeHidden();
	const tile = page.locator('[data-logo="app/figma"] button');
	await tile.click();
	const sheet = page.getByRole("dialog", { name: "figma" });
	await expect(sheet).toBeVisible();
	expect(await sheet.evaluate((el) => el.contains(document.activeElement))).toBe(true);
	await expect(sheet.getByRole("tabpanel")).toContainText("AppFigmaLogo");
	await page.keyboard.press("Escape");
	await expect(sheet).toBeHidden();
	await expect(tile).toBeFocused();
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
