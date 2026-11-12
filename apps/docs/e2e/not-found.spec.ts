// Página 404: la que se sirve para cualquier dirección que no existe.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("una dirección que no existe da 404 con la página propia", async ({ page }) => {
	const response = await page.goto("/esto-no-existe/");
	expect(response?.status()).toBe(404);
	await expect(page).toHaveTitle(/Página no encontrada/);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página no existe");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
	// Fuera de la búsqueda de texto completo
	await expect(page.locator("[data-pagefind-body]")).toHaveCount(0);
	await expect(
		page.locator("[data-not-found]").getByRole("link", { name: "Ir a la portada" }),
	).toHaveAttribute("href", "/");
});

test("«Buscar en Regula» abre la búsqueda global", async ({ page }) => {
	await page.goto("/esto-no-existe/");
	await expect(page.locator("astro-island:not([ssr])").filter({ hasText: "Buscar" })).toHaveCount(2);
	await page.locator("[data-not-found]").getByRole("button", { name: "Buscar en Regula" }).click();
	await expect(page.getByRole("dialog", { name: "Buscar en Regula" })).toBeVisible();
});

for (const dark of [false, true])
	test(`sin fallos de accesibilidad serios (${dark ? "oscuro" : "claro"})`, async ({ page }) => {
		await page.emulateMedia({ colorScheme: dark ? "dark" : "light" });
		await page.goto("/esto-no-existe/");
		const { violations } = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
			.analyze();
		expect(violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
	});
