// Playground genérico de la página de componente (design §4): los controles cambian el ejemplo y su código, y
// cada playground aguanta el primer y el último valor de cada control sin errores.
import { expect, type Locator, type Page, test } from "@playwright/test";
import { slugOf } from "../src/lib/catalog";
import { STARTS } from "../src/lib/playground";

test("Button: elegir secondary en hierarchy cambia el botón y el código", async ({ page }) => {
	await page.goto("/components/button/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await expect(pg.locator("astro-island")).not.toHaveAttribute("ssr", /.*/);
	const preview = pg.locator("[data-playground-preview]");
	const button = preview.getByRole("button", { name: "Nuevo gasto" });
	const before = await button.evaluate((b) => getComputedStyle(b).backgroundColor);
	await choose(pg, "hierarchy", "secondary");
	await expect(pg.getByRole("tabpanel")).toContainText(
		'<Button hierarchy="secondary">Nuevo gasto</Button>',
	);
	// El fondo cambia con una transición
	await expect.poll(() => button.evaluate((b) => getComputedStyle(b).backgroundColor)).not.toBe(before);
	await flip(page, pg.getByRole("switch", { name: "loading" }));
	await expect(pg.getByRole("tabpanel")).toContainText('<Button hierarchy="secondary" loading>');
	await expect(preview.getByRole("button", { name: "Nuevo gasto" })).toHaveAttribute("aria-busy", "true");
});

test("el código copiado del playground es el que se ve e importa de @jotis-me/react", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/components/badge/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await expect(pg.locator("astro-island")).not.toHaveAttribute("ssr", /.*/);
	await choose(pg, "type", "modern");
	await pg.getByRole("button", { name: /copiar/i }).click();
	// El portapapeles de Windows devuelve los saltos como \r\n
	const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n");
	expect(copied).toBe('import { Badge } from "@jotis-me/react";\n\n<Badge type="modern">Pagado</Badge>');
});

test("los controles son desplegables, van encima de la vista previa y el código va aparte", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/components/button/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await expect(pg.locator("astro-island")).not.toHaveAttribute("ssr", /.*/);
	// Ningún grupo de botones: cada prop con valores cerrados es un desplegable
	await expect(pg.locator("[data-pg-control=choice] button[aria-haspopup=listbox]")).toHaveCount(
		await pg.locator("[data-pg-control=choice]").count(),
	);
	await expect(pg.locator("[data-pg-control=choice] [role=group]")).toHaveCount(0);
	const controls = await pg.locator("[data-playground-controls]").boundingBox();
	const preview = await pg.locator("[data-playground-preview]").boundingBox();
	const code = await pg.getByRole("tablist").boundingBox();
	expect(controls && preview && controls.y + controls.height <= preview.y).toBe(true);
	// El código no va pegado: hay hueco entre la caja del ejemplo y el CodeSnippet
	expect(preview && code && code.y - (preview.y + preview.height)).toBeGreaterThanOrEqual(16);
});

test("en móvil los desplegables ocupan todo el ancho y cambian el código", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/components/button/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await expect(pg.locator("astro-island")).not.toHaveAttribute("ssr", /.*/);
	await choose(pg, "hierarchy", "link-gray");
	await expect(pg.getByRole("tabpanel")).toContainText(
		'<Button hierarchy="link-gray">Nuevo gasto</Button>',
	);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("un componente sin playground enseña solo sus ejemplos", async ({ page }) => {
	await page.goto("/components/breadcrumbs/");
	await expect(page.locator("section[aria-labelledby=ejemplo]")).toHaveCount(0);
	await expect(page.locator("#variantes")).toBeVisible();
});

/** Abre el desplegable de un control (el `Select` del paquete) y elige una opción por su nombre. */
async function choose(pg: Locator, control: string, value: string) {
	await pg.getByRole("button", { name: new RegExp(String.raw`\b${control}$`) }).click();
	await pg.page().getByRole("listbox").last().getByRole("option", { name: value, exact: true }).click();
}

/** Elige en cada control su primer o su último valor. */
async function extremes(page: Page, which: "first" | "last") {
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	const triggers = pg
		.locator("[data-pg-control=choice] button[aria-haspopup=listbox]")
		.filter({ visible: true });
	for (let i = 0; i < (await triggers.count()); i++) {
		await triggers.nth(i).click();
		const options = page.getByRole("listbox").last().getByRole("option");
		await (which === "first" ? options.first() : options.last()).click();
	}
	for (const toggle of await pg.locator("[data-playground-controls]").getByRole("switch").all())
		if ((await toggle.isChecked()) !== (which === "last")) await flip(page, toggle);
}

/** Pulsa un Toggle: el input va oculto bajo su dibujo, así que se pulsa la etiqueta que lo envuelve. */
const flip = (_page: Page, toggle: Locator) => toggle.locator("xpath=ancestor::label[1]").click();

// Uno por componente con playground (los de STARTS), para que corran en paralelo
for (const name of Object.keys(STARTS))
	test(`humo: ${name} se monta con el primer y el último valor de cada control sin errores`, async ({
		page,
	}) => {
		const errors: string[] = [];
		page.on("pageerror", (e) => errors.push(e.message));
		page.on("console", (m) => {
			if (m.type() === "error") errors.push(m.text());
		});
		await page.goto(`/components/${slugOf(name)}/`);
		const pg = page.locator("section[aria-labelledby=ejemplo]");
		await expect(pg.locator("astro-island").first()).not.toHaveAttribute("ssr", /.*/);
		for (const which of ["first", "last"] as const) {
			await extremes(page, which);
			await expect(pg.locator("[data-playground-preview] > div:last-child > *").first()).toBeAttached();
		}
		expect(errors).toEqual([]);
	});

test("BackgroundPattern: el patrón llena su marco y cambia con los controles", async ({ page }) => {
	await page.goto("/components/background-pattern/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await expect(pg.locator("astro-island").first()).not.toHaveAttribute("ssr", /.*/);
	const preview = pg.locator("[data-playground-preview]");
	// Sin la rejilla decorativa del playground: el único patrón es el del componente
	await expect(preview.locator("svg")).toHaveCount(1);
	const frame = await preview.locator("> div").first().boundingBox();
	expect(frame?.height).toBe(200);
	const before = await preview.locator("svg").innerHTML();
	await choose(pg, "pattern", "circles");
	await expect.poll(() => preview.locator("svg").innerHTML()).not.toBe(before);
	await expect(pg.locator("pre")).toContainText('pattern="circles"');
});

test("Button: elegir un icono lo pinta y lo escribe en el código; «Ninguno» lo quita", async ({ page }) => {
	await page.goto("/components/button/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await expect(pg.locator("astro-island").first()).not.toHaveAttribute("ssr", /.*/);
	await choose(pg, "iconLeading", "plus");
	await expect(pg.getByRole("tabpanel")).toContainText('<Button iconLeading="plus">Nuevo gasto</Button>');
	await expect(pg.locator("[data-playground-preview] button svg")).toHaveCount(1);
	await choose(pg, "iconLeading", "Ninguno");
	await expect(pg.getByRole("tabpanel")).toContainText("<Button>Nuevo gasto</Button>");
	await expect(pg.locator("[data-playground-preview] button svg")).toHaveCount(0);
});

test("Skeleton: escribir un número en width cambia el ancho y el código", async ({ page }) => {
	await page.goto("/components/skeleton/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	const width = pg.locator('[data-pg-control="number"]').filter({ hasText: "width" }).locator("input");
	await expect(pg.locator("astro-island").first()).not.toHaveAttribute("ssr", /.*/);
	await width.fill("220");
	await width.blur();
	await expect(pg.getByRole("tabpanel")).toContainText("width={220}");
});
