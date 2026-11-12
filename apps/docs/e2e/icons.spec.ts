import { readFileSync } from "node:fs";
import { join } from "node:path";
import { allIconNames, iconNames } from "@jotis-me/icons";
import { expect, type Page, test } from "@playwright/test";

const total = allIconNames.length;
const categories: Record<string, string[]> = JSON.parse(
	readFileSync(join(import.meta.dirname, "../../../packages/icons/assets/icon-categories.json"), "utf8"),
);
// La galería ordena los iconos por nombre, como `localeCompare`
const sorted = (names: readonly string[]) => [...names].sort((a, b) => a.localeCompare(b));

/** La galería es una isla: espera a que se hidrate antes de usarla. */
async function ready(page: Page) {
	await page.goto("/icons/");
	await expect(
		page.locator("astro-island").filter({ has: page.locator("#icon-search") }),
	).not.toHaveAttribute("ssr", /.*/);
}

/** Pulsa «Mostrar más» hasta que no quede nada por mostrar. */
async function showAll(page: Page) {
	const more = page.locator("#icon-more");
	while (await more.isVisible()) await more.click();
}

test("la galería enseña los primeros iconos con el recuento total y pide «Mostrar más» para el resto", async ({
	page,
}) => {
	await ready(page);
	await expect(page.locator("#icon-count")).toHaveText(`${total} iconos`);
	await expect(page.locator("[data-item]")).toHaveCount(96);
	await page.locator("#icon-more").click();
	await expect(page.locator("[data-item]")).toHaveCount(96 + 240);
	await showAll(page);
	await expect(page.locator("[data-item]")).toHaveCount(total);
	await expect(page.locator("#icon-more")).toBeHidden();
});

test("el HTML de /icons/ y los SVG que se piden no crecen con los 1.172 iconos", async ({
	page,
	request,
}) => {
	const html = await (await request.get("/icons/")).text();
	expect(Buffer.byteLength(html)).toBeLessThan(400 * 1024);
	const svgs = new Set<string>();
	page.on("request", (r) => {
		if (/\.svg(\?|$)/.test(r.url())) svgs.add(r.url());
	});
	await ready(page);
	await page.waitForLoadState("networkidle");
	// Las imágenes de la rejilla son perezosas: solo se piden las que están a la vista (más el panel)
	expect(svgs.size).toBeGreaterThan(5);
	expect(svgs.size).toBeLessThan(160);
});

test("buscar «cal» deja solo los iconos cuyo nombre lo contiene", async ({ page }) => {
	await ready(page);
	await page.getByLabel("Buscar icono").fill("cal");
	const expected = sorted(allIconNames.filter((n) => n.includes("cal")));
	await expect(page.locator("#icon-count")).toHaveText(`${expected.length} de ${total}`);
	await showAll(page);
	const visible = await page
		.locator("[data-item]")
		.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.item as string));
	expect(visible).toEqual(expected);
	expect(visible).toContain("calendar");
});

test("sin resultados lo dice", async ({ page }) => {
	await ready(page);
	await page.getByLabel("Buscar icono").fill("zzzz");
	await expect(page.getByText("Ese icono no está en el set")).toBeVisible();
	await expect(page.locator("#icon-count")).toHaveText(`0 de ${total}`);
});

test("filtrar por categoría deja solo los iconos de esa categoría", async ({ page }) => {
	await ready(page);
	await page.getByRole("button", { name: /Categoría/ }).click();
	await page.getByRole("option", { name: /^Tiempo/ }).click();
	const expected = categories.time as string[];
	await expect(page.locator("#icon-count")).toHaveText(`${expected.length} de ${total}`);
	const visible = await page
		.locator("[data-item]")
		.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.item as string));
	expect(sorted(visible)).toEqual(sorted(expected));
});

test("el tamaño de vista previa cambia los iconos de la rejilla", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await ready(page);
	await page.getByLabel("Buscar icono").fill("calendar");
	const img = page.locator('[data-select="calendar"] img');
	await expect(img).toHaveAttribute("height", "24");
	await page
		.getByRole("group", { name: "Tamaño de vista previa" })
		.getByRole("button", { name: "16" })
		.click();
	await expect(img).toHaveAttribute("height", "16");
});

test("elegir calendar: el panel lo muestra y su código usa @jotis-me/icons; se copia el nombre", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.setViewportSize({ width: 1440, height: 900 });
	await ready(page);
	await page.getByLabel("Buscar icono").fill("calendar");
	await page.locator('[data-select="calendar"]').click();
	await expect(page.locator('[data-select="calendar"]')).toHaveAttribute("aria-pressed", "true");
	const panel = page.getByRole("complementary", { name: "Icono elegido" });
	await expect(panel.locator("#icon-detail-name")).toHaveText("calendar");
	await expect(panel).toContainText("IconCalendar");
	const code = panel.getByRole("tabpanel");
	// Está en el núcleo: se puede pintar por nombre y con su componente
	await expect(code).toContainText('import { Icon, IconCalendar } from "@jotis-me/icons";');
	await expect(code).toContainText('<Icon name="calendar" size={20} />');
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

test("un icono fuera del núcleo se usa con su componente suelto, no con `Icon name`", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await ready(page);
	expect(iconNames).not.toContain("rocket-02");
	await page.getByLabel("Buscar icono").fill("rocket-02");
	await page.locator('[data-select="rocket-02"]').click();
	const panel = page.getByRole("complementary", { name: "Icono elegido" });
	await expect(panel.locator("#icon-detail-name")).toHaveText("rocket-02");
	const code = panel.getByRole("tabpanel");
	await expect(code).toContainText('import { IconRocket02 } from "@jotis-me/icons";');
	await expect(code).not.toContainText("<Icon name=");
	await panel.getByRole("tab", { name: "SVG", exact: true }).click();
	await expect(code).toContainText('stroke="currentColor"');
});

test("la página avisa del cambio de `Icon name` a quien viene de una versión anterior", async ({ page }) => {
	await ready(page);
	const note = page.locator("#icon-core-note");
	await expect(note).toContainText(`${iconNames.length} iconos del núcleo`);
	await expect(note).toContainText("IconRocket02");
});

test("en móvil, tocar un icono abre la hoja con su código y Escape la cierra devolviendo el foco", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await ready(page);
	await expect(page.getByRole("complementary", { name: "Icono elegido" })).toBeHidden();
	await page.getByLabel("Buscar icono").fill("trash-01");
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
