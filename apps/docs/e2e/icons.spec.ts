import { iconNames } from "@jotis-me/icons";
import { expect, type Page, test } from "@playwright/test";

const total = iconNames.length;

/** La galería es una isla: espera a que se hidrate antes de usarla. */
async function ready(page: Page) {
	await page.goto("/icons/");
	await expect(
		page.locator("astro-island").filter({ has: page.locator("#icon-search") }),
	).not.toHaveAttribute("ssr", /.*/);
}

test("la galería muestra todos los iconos con su recuento", async ({ page }) => {
	await ready(page);
	await expect(page.locator("[data-icon]")).toHaveCount(total);
	await expect(page.locator("#icon-count")).toHaveText(`${total} iconos`);
});

test("buscar «cal» deja solo los iconos cuyo nombre lo contiene", async ({ page }) => {
	await ready(page);
	await page.getByLabel("Buscar icono").fill("cal");
	const expected = iconNames.filter((n) => n.includes("cal")).sort();
	await expect(page.locator("#icon-count")).toHaveText(`${expected.length} de ${total}`);
	const visible = await page
		.locator("[data-icon]:not([hidden])")
		.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.icon as string).sort());
	expect(visible).toEqual(expected);
	expect(visible).toContain("calendar");
});

test("sin resultados lo dice", async ({ page }) => {
	await ready(page);
	await page.getByLabel("Buscar icono").fill("zzzz");
	await expect(page.getByText("Ese icono no está en el set")).toBeVisible();
	await expect(page.locator("#icon-count")).toHaveText(`0 de ${total}`);
});

test("el tamaño de vista previa cambia los iconos de la rejilla", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await ready(page);
	const svg = page.locator('[data-select="calendar"] svg');
	await expect(svg).toHaveAttribute("width", "24");
	await page
		.getByRole("group", { name: "Tamaño de vista previa" })
		.getByRole("button", { name: "16" })
		.click();
	await expect(svg).toHaveAttribute("width", "16");
});

test("elegir calendar: el panel lo muestra y su código usa @jotis-me/icons; se copia el nombre", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.setViewportSize({ width: 1440, height: 900 });
	await ready(page);
	await page.locator('[data-select="calendar"]').click();
	await expect(page.locator('[data-select="calendar"]')).toHaveAttribute("aria-pressed", "true");
	const panel = page.getByRole("complementary", { name: "Icono elegido" });
	await expect(panel.locator("#icon-detail-name")).toHaveText("calendar");
	await expect(panel).toContainText("IconCalendar");
	const code = panel.getByRole("tabpanel");
	await expect(code).toContainText('import { IconCalendar } from "@jotis-me/icons";');
	await panel.getByRole("tab", { name: "Importar SVG" }).click();
	await expect(code).toContainText('from "@jotis-me/icons/svg/calendar.svg?raw"');
	await panel.getByRole("tab", { name: "SVG", exact: true }).click();
	await expect(code).toContainText('stroke="currentColor"');
	await panel.getByRole("button", { name: "Copiar nombre" }).click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("calendar");
	// Uso por contexto de la guía
	for (const t of ["Botón e input", "xs y menús", "Navegación"])
		await expect(panel.getByText(t)).toBeVisible();
});

test("en móvil, tocar un icono abre la hoja con su código y Escape la cierra devolviendo el foco", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await ready(page);
	await expect(page.getByRole("complementary", { name: "Icono elegido" })).toBeHidden();
	const tile = page.locator('[data-select="trash-01"]');
	await tile.click();
	const sheet = page.getByRole("dialog", { name: "trash-01" });
	await expect(sheet).toBeVisible();
	await expect(sheet.getByRole("tabpanel")).toContainText("IconTrash01");
	await page.keyboard.press("Escape");
	await expect(sheet).toBeHidden();
	await expect(tile).toBeFocused();
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
