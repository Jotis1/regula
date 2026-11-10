import { readdirSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";

// Las galerías de banderas, pagos, archivos y cursores son la misma isla (`AssetGallery`) que la de iconos.
const dist = (dir: string) => join(import.meta.dirname, "../../../packages/icons/dist", dir);
const count = (dir: string) => readdirSync(dist(dir)).filter((f) => f.endsWith(".svg")).length;

const GALLERIES = [
	{
		kind: "flags",
		path: "/icons/flags/",
		prefix: "flag",
		noun: "banderas",
		entries: count("flags") / 3,
		label: "Buscar bandera",
	},
	{
		kind: "payments",
		path: "/icons/payments/",
		prefix: "payment",
		noun: "métodos de pago",
		entries: count("payments") / 2,
		label: "Buscar método de pago",
	},
	{
		kind: "files",
		path: "/icons/files/",
		prefix: "file",
		noun: "iconos de archivo",
		entries: 55,
		label: "Buscar tipo de archivo",
	},
	{
		kind: "cursors",
		path: "/icons/cursors/",
		prefix: "cursor",
		noun: "cursores",
		entries: count("cursors"),
		label: "Buscar cursor",
	},
] as const;

async function ready(page: Page, g: (typeof GALLERIES)[number]) {
	await page.goto(g.path);
	await expect(
		page.locator("astro-island").filter({ has: page.locator(`#${g.prefix}-search`) }),
	).not.toHaveAttribute("ssr", /.*/);
}

for (const g of GALLERIES) {
	test.describe(g.kind, () => {
		test(`${g.path} enseña el recuento y el HTML no pasa de 400 kB`, async ({ page, request }) => {
			const html = await (await request.get(g.path)).text();
			expect(Buffer.byteLength(html)).toBeLessThan(400 * 1024);
			await ready(page, g);
			await expect(page.locator(`#${g.prefix}-count`)).toHaveText(`${g.entries} ${g.noun}`);
			expect(await page.locator("[data-item]").count()).toBeGreaterThan(0);
		});

		test("el selector de iconos y recursos enlaza las seis galerías y marca la actual", async ({
			page,
		}) => {
			await ready(page, g);
			const nav = page.getByRole("navigation", { name: "Iconos y recursos" });
			for (const name of ["Iconos", "Logos", "Banderas", "Pagos", "Archivos", "Cursores"])
				await expect(nav.getByRole("link", { name })).toBeVisible();
			await expect(nav.locator("[aria-current=page]")).toHaveCount(1);
		});

		test("sin resultados lo dice", async ({ page }) => {
			await ready(page, g);
			await page.getByLabel(g.label).fill("zzzz");
			await expect(page.locator(`#${g.prefix}-count`)).toHaveText(new RegExp(`^0 de ${g.entries}$`));
			await expect(page.locator("[data-item]")).toHaveCount(0);
		});
	});
}

test("banderas: buscar «spain», elegirla y ver sus tres formas con su código; se copia el nombre", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.setViewportSize({ width: 1440, height: 900 });
	const g = GALLERIES[0];
	await ready(page, g);
	await page.getByLabel(g.label).fill("spain");
	await expect(page.locator("[data-item]")).toHaveCount(1);
	await page.locator('[data-select="spain"]').click();
	const panel = page.getByRole("complementary", { name: "Bandera elegida" });
	await expect(panel.locator("#flag-detail-name")).toHaveText("spain");
	for (const f of ["Círculo", "Cuadrado", "Rectángulo"])
		await expect(panel.getByText(f, { exact: true })).toBeVisible();
	const code = panel.getByRole("tabpanel");
	await expect(code).toContainText(
		'import { FlagSpainCircle, FlagSpainSquare, FlagSpainRectangle } from "@jotis-me/icons/flags";',
	);
	await panel.getByRole("tab", { name: "Importar SVG" }).click();
	await expect(code).toContainText('from "@jotis-me/icons/flags/spain-circle.svg?raw"');
	await panel.getByRole("button", { name: "Copiar nombre" }).click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("spain");
});

test("banderas: la forma de la vista previa cambia las imágenes de la rejilla", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await ready(page, GALLERIES[0]);
	await page.getByLabel("Buscar bandera").fill("spain");
	const img = page.locator('[data-select="spain"] img');
	await expect(img).toHaveAttribute("src", /spain-circle/);
	await page
		.getByRole("group", { name: "Forma de la vista previa" })
		.getByRole("button", { name: "Cuadrado" })
		.click();
	await expect(img).toHaveAttribute("src", /spain-square/);
});

test("pagos: «visa» tiene sm y md, y su código importa los dos de @jotis-me/icons/payments", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	const g = GALLERIES[1];
	await ready(page, g);
	await page.getByLabel(g.label).fill("visa");
	await page.locator('[data-select="visa"]').click();
	const panel = page.getByRole("complementary", { name: "Método de pago elegido" });
	await expect(panel.locator("#payment-detail-name")).toHaveText("visa");
	await expect(panel.getByRole("tabpanel")).toContainText(
		'import { PaymentVisaSm, PaymentVisaMd } from "@jotis-me/icons/payments";',
	);
	await expect(panel).toContainText("Cada marca es de su dueño");
});

test("archivos: «pdf» da el genérico y el de documento, y filtrar por Carpetas deja las 4 carpetas", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	const g = GALLERIES[2];
	await ready(page, g);
	await page.getByLabel(g.label).fill("pdf");
	const names = await page
		.locator("[data-item]")
		.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.item as string).sort());
	expect(names).toEqual(["document-pdf", "generic-pdf"]);
	await page.locator('[data-select="document-pdf"]').click();
	const panel = page.getByRole("complementary", { name: "Icono de archivo elegido" });
	await expect(panel.getByRole("tabpanel")).toContainText(
		'import { FileDocumentPdf, FileDocumentPdfGray, FileDocumentPdfSolid } from "@jotis-me/icons/files";',
	);
	await page.getByLabel(g.label).fill("");
	await page.getByRole("button", { name: /Tipo/ }).click();
	await page.getByRole("option", { name: /^Carpetas/ }).click();
	await expect(page.locator("[data-item]")).toHaveCount(4);
	await page.locator('[data-select="folder-brand"]').click();
	await expect(panel.getByRole("tabpanel")).toContainText(
		'import { FolderBrand, FolderBrandOpen } from "@jotis-me/icons/files";',
	);
});

test("cursores: «hand-grab» ofrece su código de React y la regla de CSS con la URL del SVG", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	const g = GALLERIES[3];
	await ready(page, g);
	await page.getByLabel(g.label).fill("hand-grab");
	await page.locator('[data-select="hand-grab"]').click();
	const panel = page.getByRole("complementary", { name: "Cursor elegido" });
	await expect(panel.getByRole("tabpanel")).toContainText(
		'import { CursorHandGrab } from "@jotis-me/icons/cursors";',
	);
	await panel.getByRole("tab", { name: "CSS" }).click();
	await expect(panel.getByRole("tabpanel")).toContainText(
		'cursor: url("@jotis-me/icons/cursors/hand-grab.svg") 6 4, grab;',
	);
	await expect(panel).toContainText("El SVG no lleva el punto activo");
});

test("en móvil, una galería nueva abre la hoja y no desborda", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	const g = GALLERIES[0];
	await ready(page, g);
	await page.getByLabel(g.label).fill("japan");
	await page.locator('[data-select="japan"]').click();
	const sheet = page.getByRole("dialog", { name: "japan" });
	await expect(sheet).toBeVisible();
	await expect(sheet.getByRole("tabpanel")).toContainText("FlagJapanCircle");
	await page.keyboard.press("Escape");
	await expect(sheet).toBeHidden();
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
