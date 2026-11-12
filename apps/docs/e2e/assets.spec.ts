import { readdirSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";
import * as flags from "@untitledui/country-flags";

// Las galerías de banderas, pagos, archivos y cursores son la misma isla (`AssetGallery`) que la de iconos.
const dist = (dir: string) => join(import.meta.dirname, "../../../packages/assets/dist", dir);
const count = (dir: string) => readdirSync(dist(dir)).filter((f) => f.endsWith(".svg")).length;
// Banderas y tipos de archivo son los de Untitled UI: su recuento sale de los propios paquetes
const flagCount = Object.keys(flags).filter((k) => /^Flag[A-Z]/.test(k)).length;
const fileTypes = 52;

const GALLERIES = [
	{
		kind: "flags",
		path: "/icons/flags/",
		prefix: "flag",
		noun: "banderas",
		entries: flagCount,
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
		entries: fileTypes,
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

test("banderas: buscar «españa», elegirla y ver su código; se copia el nombre", async ({ page, context }) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.setViewportSize({ width: 1440, height: 900 });
	const g = GALLERIES[0];
	await ready(page, g);
	await page.getByLabel(g.label).fill("españa");
	await expect(page.locator("[data-item]")).toHaveCount(1);
	await page.locator('[data-select="es"]').click();
	const panel = page.getByRole("complementary", { name: "Bandera elegida" });
	await expect(panel.locator("#flag-detail-name")).toContainText("es");
	await expect(panel.locator("#flag-detail-name")).toContainText("España");
	const code = panel.getByRole("tabpanel");
	await expect(code).toContainText('import { FlagEs } from "@untitledui/country-flags";');
	await expect(code).toContainText("<FlagEs size={24} />");
	await expect(panel.getByRole("tab", { name: "Importar SVG" })).toHaveCount(0);
	await panel.getByRole("button", { name: "Copiar nombre" }).click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("es");
});

test("banderas: se buscan también por su código y sin tildes", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await ready(page, GALLERIES[0]);
	await page.getByLabel("Buscar bandera").fill("japon");
	await expect(page.locator('[data-select="jp"]')).toBeVisible();
	await page.getByLabel("Buscar bandera").fill("jp");
	await expect(page.locator('[data-select="jp"] img')).toHaveAttribute("src", /\/flags\/jp\.svg/);
});

test("banderas: la misma bandera dos veces en una página se ve entera (los id del recorte se repiten)", async ({
	page,
	request,
}) => {
	// El SVG de la bandera lleva un `clipPath` con id fijo (`ES_svg__a`): dos copias en línea comparten id
	const svg = await (await request.get("/icons/svg/flags/es.svg")).text();
	expect((svg.match(/id="ES_svg__a"/g) ?? []).length).toBe(1);
	const big = svg.replace('width="24" height="24"', 'width="48" height="48"');
	await page.setContent(
		`<body style="margin:0"><div id="a" style="width:48px;height:48px">${big}</div><div id="b" style="width:48px;height:48px">${big}</div></body>`,
	);
	const first = await page.locator("#a").screenshot();
	const second = await page.locator("#b").screenshot();
	expect(second.equals(first)).toBe(true);
	// Y no es un cuadro vacío: tiene los colores de la bandera, no solo transparencia
	expect(first.length).toBeGreaterThan(300);
});

test("pagos: «visa» tiene sm y md, y su código importa los dos de @jotis-me/assets/payments", async ({
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
		'import { PaymentVisaSm, PaymentVisaMd } from "@jotis-me/assets/payments";',
	);
	await expect(panel).toContainText("Cada marca es de su dueño");
});

test("archivos: «pdf» da el de documento y «pdf-simple», y su código usa FileIcon con las tres variantes", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	const g = GALLERIES[2];
	await ready(page, g);
	await page.getByLabel(g.label).fill("pdf");
	const names = await page
		.locator("[data-item]")
		.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.item as string).sort());
	expect(names).toEqual(["pdf", "pdf-simple"]);
	await page.locator('[data-select="pdf"]').click();
	const panel = page.getByRole("complementary", { name: "Icono de archivo elegido" });
	const code = panel.getByRole("tabpanel");
	await expect(code).toContainText('import { FileIcon } from "@untitledui/file-icons";');
	for (const tag of [
		'<FileIcon type="pdf" size={40} />',
		'<FileIcon type="pdf" variant="gray" size={40} />',
		'<FileIcon type="pdf" variant="solid" size={40} />',
	])
		await expect(code).toContainText(tag);
	await page.getByLabel(g.label).fill("");
	await page.getByRole("button", { name: /Tipo/ }).click();
	await page.getByRole("option", { name: /^Archivos comprimidos|^Comprimidos/ }).click();
	await expect(page.locator("[data-item]")).toHaveCount(2);
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
		'import { CursorHandGrab } from "@jotis-me/assets/cursors";',
	);
	await panel.getByRole("tab", { name: "CSS" }).click();
	await expect(panel.getByRole("tabpanel")).toContainText(
		'cursor: url("@jotis-me/assets/cursors/hand-grab.svg") 6 4, grab;',
	);
	await expect(panel).toContainText("El SVG no lleva el punto activo");
});

test("en móvil, una galería nueva abre la hoja y no desborda", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	const g = GALLERIES[0];
	await ready(page, g);
	await page.getByLabel(g.label).fill("japón");
	await page.locator('[data-select="jp"]').click();
	const sheet = page.getByRole("dialog", { name: /jp/ });
	await expect(sheet).toBeVisible();
	await expect(sheet.getByRole("tabpanel")).toContainText("FlagJp");
	await page.keyboard.press("Escape");
	await expect(sheet).toBeHidden();
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
