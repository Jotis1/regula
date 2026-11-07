// MultiSelect en el navegador: abrir, buscar, elegir y cerrar con teclado, y la lista a 390px.
import { expect, type Page, test } from "@playwright/test";

async function open(page: Page) {
	await page.goto("/visual/multi-select/");
	// Hidratado de verdad: Astro quita `ssr` de la isla al llamar a hydrateRoot, pero React hidrata después.
	await page.waitForFunction(() => {
		const field = document.querySelector("button[aria-expanded]");
		return !!field && Object.keys(field).some((k) => k.startsWith("__reactProps"));
	});
	// El primero del ejemplo: sin nada elegido.
	return page.getByRole("button", { name: "Equipos", exact: false }).first();
}

test("teclado: Enter abre con el foco en el buscador, flechas y Enter eligen, Escape cierra", async ({
	page,
}) => {
	const field = await open(page);
	await field.focus();
	await page.keyboard.press("Enter");
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();
	const search = dialog.getByRole("searchbox", { name: "Buscar" });
	await expect(search).toBeFocused();

	await page.keyboard.type("mar");
	await expect(dialog.getByRole("option")).toHaveCount(1);
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect(dialog.getByRole("option", { name: /Márketing/ })).toHaveAttribute("aria-selected", "true");
	await expect(search).toHaveValue("mar");
	await expect(field).toContainText("1 elegido");

	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();
	await expect(field).toBeFocused();
	await expect(field).toContainText("1 elegido");
});

test.describe("a 390px", () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test("la lista cabe en la pantalla, se elige con el dedo y el pie se alcanza", async ({ page }) => {
		const field = await open(page);
		await field.click();
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible();
		const box = await dialog.boundingBox();
		expect(box).not.toBeNull();
		if (box) {
			expect(box.x).toBeGreaterThanOrEqual(0);
			expect(box.x + box.width).toBeLessThanOrEqual(390);
		}
		await dialog.getByRole("option", { name: /Diseño/ }).click();
		await expect(field).toContainText("1 elegido");
		await dialog.getByRole("button", { name: "Elegir todo" }).click();
		await expect(field).toContainText("7 elegidos");
		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden();
	});
});
