import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

/** La isla de búsqueda se hidrata con `client:idle`: hasta entonces el atajo no responde. La cabecera lleva una por versión (escritorio y móvil). */
async function ready(page: Page, path = "/") {
	await page.goto(path);
	await expect(page.locator("astro-island:not([ssr])").filter({ hasText: "Buscar" })).toHaveCount(2);
}

const dialog = (page: Page) => page.getByRole("dialog", { name: "Buscar en Regula" });

// Ctrl+K hasta que se abra: con el equipo cargado, el atajo puede llegar antes de que el script lo escuche
const open = (page: Page) =>
	expect(async () => {
		if (!(await dialog(page).isVisible())) await page.keyboard.press("Control+k");
		await expect(dialog(page)).toBeVisible({ timeout: 2_000 });
	}).toPass({ timeout: 20_000 });

test('Ctrl+K, "modal" y Enter llevan a la página de Modal', async ({ page }) => {
	await ready(page, "/foundations/color/");
	await open(page);
	await page.keyboard.type("modal");
	const first = page.getByRole("option").first();
	await expect(first).toHaveAccessibleName(/^Modal/);
	await page.keyboard.press("Enter");
	await expect(page).toHaveURL(/\/components\/modal\/$/);
	await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Modal");
});

for (const dark of [false, true]) {
	test(`el diálogo abierto, con resultados, no tiene fallos serios (${dark ? "oscuro" : "claro"})`, async ({
		page,
	}) => {
		await page.emulateMedia({ colorScheme: dark ? "dark" : "light" });
		await ready(page);
		await open(page);
		await page.getByRole("combobox", { name: "Buscar en Regula" }).fill("cal");
		await expect(page.getByRole("group", { name: "Iconos" })).toBeVisible();
		const { violations } = await new AxeBuilder({ page })
			.include('[role="dialog"]')
			.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
			.analyze();
		expect(violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
	});
}

test("cada componente lleva su grupo del catálogo como descripción", async ({ page }) => {
	await ready(page);
	await open(page);
	const search = page.getByRole("combobox", { name: "Buscar en Regula" });
	await search.fill("modal");
	await expect(
		page.getByRole("group", { name: "Componentes" }).getByRole("option", { name: /^Modal/ }),
	).toContainText("Capas");
	// El nombre se lee separado («Stream alert»), pero el identificador sigue encontrándolo
	await search.fill("streamalert");
	await expect(
		page.getByRole("group", { name: "Componentes" }).getByRole("option", { name: /^Stream alert/ }),
	).toContainText("Stream · Alertas");
});

test("sin resultados, sugiere buscar por lo que hace", async ({ page }) => {
	await ready(page);
	await open(page);
	await page.getByRole("combobox", { name: "Buscar en Regula" }).fill("zzqxj");
	await expect(page.getByText("Nada por aquí. Prueba con lo que hace (borrar, fecha)")).toBeVisible();
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
	await open(page);
	// fill y no keyboard.type: con el equipo cargado, las primeras letras llegaban antes que el foco y se perdían
	await page.getByRole("combobox", { name: "Buscar en Regula" }).fill("bg-brand-solid");
	await expect(
		page.getByRole("group", { name: "Tokens" }).getByRole("option").first(),
	).toHaveAccessibleName(/^bg-brand-solid/);
	await page.getByRole("combobox").fill("calendar");
	await page
		.getByRole("group", { name: "Iconos" })
		.getByRole("option", { name: /^Calendar\b/ })
		.first()
		.click();
	await expect(page).toHaveURL(/\/icons\/\?icono=Calendar$/);
	await expect(page.locator("#icon-search")).toHaveValue("Calendar");
	await expect(page.locator('[data-item="Calendar"] button')).toHaveAttribute("aria-pressed", "true");
});

test("busca también en el texto de las páginas (Pagefind)", async ({ page }) => {
	await ready(page);
	await open(page);
	await page.getByRole("combobox", { name: "Buscar en Regula" }).fill("virgulilla");
	const text = page.getByRole("group", { name: "En el texto" });
	// Pagefind carga su WebAssembly y el índice al primer uso: con el equipo cargado tarda más de 5 s
	await expect(text.getByRole("option").first()).toBeVisible({ timeout: 15_000 });
});
