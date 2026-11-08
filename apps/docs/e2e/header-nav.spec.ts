// HeaderNav a 1440px (la cabecera de escritorio, con su segunda fila) y a 390px (la fila móvil y su panel): una sola
// versión a la vista en cada ancho, sin desplazamiento horizontal de la cabecera. La CSS elige por el ancho de la propia cabecera.
import { expect, type Page, test } from "@playwright/test";

const open = async (page: Page, width: number) => {
	await page.setViewportSize({ width, height: 900 });
	await page.goto("/visual/header-nav/");
	await page.waitForFunction(() => {
		const buttons = document.querySelectorAll("header button");
		const button = buttons[buttons.length - 1];
		return !!button && Object.keys(button).some((k) => k.startsWith("__reactProps"));
	});
};

test("a 1440px las secciones y la segunda fila se ven, y no el botón de menú", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/visual/header-nav/");
	await page.waitForFunction(() => document.querySelectorAll("header").length >= 5);
	// La caja de 1280px de cada tipo: escritorio, con las secciones a la vista
	const dual = page.locator("header").nth(1);
	await expect(dual.getByRole("navigation", { name: "Principal" }).first()).toBeVisible();
	await expect(dual.getByRole("navigation", { name: "Subsecciones" })).toBeVisible();
	await expect(dual.getByRole("link", { name: "Resumen" })).toHaveAttribute("aria-current", "page");
	await expect(dual.getByRole("button", { name: "Abrir menú" })).toBeHidden();
	// Las pestañas de `tabs` son enlaces, no un tablist
	const tabs = page.locator("header").nth(2);
	await expect(tabs.getByRole("navigation", { name: "Subsecciones" })).toBeVisible();
	await expect(page.getByRole("tablist")).toHaveCount(0);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
});

test("a 390px la cabecera es una fila con la marca y el botón de menú, y el panel abre y cierra", async ({
	page,
}) => {
	await open(page, 390);
	// La última cabecera del ejemplo es la móvil: una caja de 375px
	const header = page.locator("header").last();
	const menu = header.getByRole("button", { name: "Abrir menú" });
	await expect(menu).toBeVisible();
	await expect(header.getByRole("navigation", { name: "Principal" })).toBeHidden();
	expect(((await header.boundingBox()) as { width: number }).width).toBeLessThanOrEqual(375);

	await menu.click();
	const panel = page.getByRole("dialog");
	await expect(panel).toBeVisible();
	const box = (await panel.boundingBox()) as { x: number; width: number };
	expect(box.x).toBe(0); // sale desde la izquierda
	expect(box.width).toBeLessThanOrEqual(296);
	const section = panel.getByRole("button", { name: /Proyectos/ });
	await expect(section).toHaveAttribute("aria-expanded", "false");
	await section.click();
	await expect(section).toHaveAttribute("aria-expanded", "true");
	await expect(panel.getByRole("link", { name: "Todos" })).toBeVisible();

	await page.keyboard.press("Escape");
	await expect(panel).toHaveCount(0);
	await expect(menu).toBeFocused();
});
