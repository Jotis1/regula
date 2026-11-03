import { expect, type Page, test } from "@playwright/test";

/** La isla de búsqueda se hidrata con `client:idle`: hasta entonces el atajo no responde. */
async function ready(page: Page, path = "/") {
	await page.goto(path);
	await expect(page.locator("astro-island:not([ssr])").filter({ hasText: "Buscar" })).toHaveCount(1);
}

const dialog = (page: Page) => page.getByRole("dialog", { name: "Buscar en Regula" });

test('Ctrl+K, "modal" y Enter llevan a la página de Modal', async ({ page }) => {
	await ready(page, "/foundations/color/");
	await page.keyboard.press("Control+k");
	await expect(dialog(page)).toBeVisible();
	await page.keyboard.type("modal");
	const first = page.getByRole("option").first();
	await expect(first).toHaveAccessibleName(/^Modal/);
	await page.keyboard.press("Enter");
	await expect(page).toHaveURL(/\/components\/modal\/$/);
	await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Modal");
});

test("Cmd+K también lo abre; Escape lo cierra y el foco vuelve", async ({ page }) => {
	await ready(page);
	const button = page.getByRole("button", { name: /Buscar/ });
	await button.focus();
	await page.keyboard.press("Meta+k");
	await expect(dialog(page)).toBeVisible();
	await expect(page.getByRole("combobox", { name: "Buscar en Regula" })).toBeFocused();
	await page.keyboard.press("Escape");
	await expect(dialog(page)).toHaveCount(0);
	await expect(button).toBeFocused();
});

test("el botón de la cabecera la abre; sin escribir se ven las páginas", async ({ page }) => {
	await ready(page);
	await page.getByRole("button", { name: /Buscar/ }).click();
	await expect(page.getByRole("group", { name: "Páginas" })).toBeVisible();
	await expect(page.getByRole("option", { name: /^Tipografía/ })).toBeVisible();
});

test("encuentra tokens e iconos; un icono abre la galería con él elegido", async ({ page }) => {
	await ready(page);
	await page.keyboard.press("Control+k");
	// fill y no keyboard.type: con el equipo cargado, las primeras letras llegaban antes que el foco y se perdían
	await page.getByRole("combobox", { name: "Buscar en Regula" }).fill("bg-brand-solid");
	await expect(
		page.getByRole("group", { name: "Tokens" }).getByRole("option").first(),
	).toHaveAccessibleName(/^bg-brand-solid/);
	await page.getByRole("combobox").fill("");
	await page.keyboard.type("calendar");
	await page
		.getByRole("group", { name: "Iconos" })
		.getByRole("option", { name: /^calendar\b/ })
		.first()
		.click();
	await expect(page).toHaveURL(/\/icons\/\?icono=calendar$/);
	await expect(page.locator("#icon-search")).toHaveValue("calendar");
	await expect(page.locator('[data-select="calendar"]')).toHaveAttribute("aria-pressed", "true");
});

test("busca también en el texto de las páginas (Pagefind)", async ({ page }) => {
	await ready(page);
	await page.keyboard.press("Control+k");
	await page.getByRole("combobox", { name: "Buscar en Regula" }).fill("virgulilla");
	const text = page.getByRole("group", { name: "En el texto" });
	// Pagefind carga su WebAssembly y el índice al primer uso: con el equipo cargado tarda más de 5 s
	await expect(text.getByRole("option").first()).toBeVisible({ timeout: 15_000 });
});
