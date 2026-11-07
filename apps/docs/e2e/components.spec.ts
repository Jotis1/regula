// Páginas de componente: ficha, ejemplos vivos, props, fragmentos de código y navegación.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";

/** El bloque de código (CodeSnippet) es una isla `client:visible`: sus pestañas responden después de hidratarse. */
async function hydrated(page: Page, selector: string) {
	const island = page.locator(`${selector} astro-island`);
	await island.scrollIntoViewIfNeeded();
	await expect(island).not.toHaveAttribute("ssr", /.*/);
}

const dir = join(import.meta.dirname, "../src/content/components");
const pages = readdirSync(dir).map((f) => ({
	slug: f.replace(/\.md$/, ""),
	name: (readFileSync(join(dir, f), "utf8").match(/^name: (.+)$/m) as RegExpMatchArray)[1] as string,
}));

test("la navegación lateral lista todas las páginas de componente", async ({ page }) => {
	await page.goto("/foundations/principles/"); // la portada va sin navegación lateral
	const nav = page.getByRole("navigation", { name: "Documentación" });
	for (const { name, slug } of pages)
		await expect(nav.getByRole("link", { name, exact: true, includeHidden: true })).toHaveAttribute(
			"href",
			`/components/${slug}/`,
		);
});

for (const { slug, name } of pages) {
	test(`${name}: ficha, ejemplos vivos, props y código`, async ({ page }) => {
		await page.goto(`/components/${slug}/`);
		// La primera: el ejemplo de PageHeader pinta su propio <h1>
		await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(name);
		await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "page");
		// La isla de ejemplos se hidrata al verse: después tiene contenido
		const examples = page.locator("#variantes + div astro-island");
		await examples.scrollIntoViewIfNeeded();
		await expect(examples).not.toHaveAttribute("ssr", /.*/);
		await expect(examples.locator(":scope > *").first()).toBeVisible();
		expect(await page.locator("section[aria-labelledby=props] tbody tr").count()).toBeGreaterThan(0);
		const code = page.locator("[data-code-tabs]");
		await expect(code.getByRole("tabpanel")).toContainText(`import { ${name} } from "@jotis-me/react";`);
	});
}

test("los ejemplos vivos no heredan los estilos del texto largo (tablas, listas, párrafos)", async ({
	page,
}) => {
	await page.goto("/components/date-picker/");
	const grid = page.locator("#variantes + div table");
	await grid.scrollIntoViewIfNeeded();
	const css = await grid.evaluate((t) => {
		const th = t.querySelector("th") as Element;
		return {
			border: getComputedStyle(t).borderTopWidth,
			thPadding: getComputedStyle(th).paddingLeft,
			thBg: getComputedStyle(th).backgroundColor,
		};
	});
	expect(css).toEqual({ border: "0px", thPadding: "0px", thBg: "rgba(0, 0, 0, 0)" });
	await page.goto("/components/text-editor/");
	const li = page.locator("#variantes + div [role=textbox] li").first();
	await li.scrollIntoViewIfNeeded();
	expect(await li.evaluate((e) => getComputedStyle(e).paddingLeft)).toBe("0px");
});

test("Button: cinco jerarquías y cinco tamaños vivos, la regla de una primaria y sus props", async ({
	page,
}) => {
	await page.goto("/components/button/");
	const examples = page.locator("#variantes + div");
	for (const label of ["Guardar", "Cancelar", "Más tarde", "Ver detalles", "Ayuda", "xs", "sm", "xl"])
		await expect(examples.getByRole("button", { name: label, exact: true })).toBeVisible();
	await expect(examples.getByRole("button", { name: "Nuevo gasto" })).toHaveCSS("height", "40px");
	await expect(examples.getByRole("button", { name: "Continuar" })).toHaveCSS("height", "44px");
	await expect(page.locator("section[aria-labelledby=uso]")).toContainText(
		"Una sola primary por vista o por modal",
	);
	const props = await page
		.locator("section[aria-labelledby=props] tbody tr td:first-child code")
		.allTextContents();
	for (const p of ["hierarchy", "size", "destructive", "iconOnly", "loading", "href"])
		expect(props).toContain(p);
});

// El texto de un párrafo de la ficha tal como se lee: sin las marcas de Markdown
const plain = (md: string) => md.replace(/\*\*|`/g, "").replace(/(^|\s)_([^_]+)_/g, "$1$2");

test("la ficha se reparte por etiqueta sin cambiar su texto: «Evita» va en la sección Evita", async ({
	page,
}) => {
	const md = readFileSync(join(dir, "cam-frame.md"), "utf8");
	const evita = (md.match(/^\*\*Evita\.\*\*.*$/m) as RegExpMatchArray)[0];
	await page.goto("/components/cam-frame/");
	const section = page.locator("[data-card-section=evita]");
	await expect(section.getByRole("heading", { name: "Evita" })).toBeVisible();
	await expect(section.locator("p")).toHaveText([plain(evita)]);
	// Y la de props va junto a su tabla
	const props = (md.match(/^\*\*Props\.\*\*.*$/m) as RegExpMatchArray)[0];
	await expect(page.locator("section[aria-labelledby=props] > p").first()).toHaveText(plain(props));
});

test("pestañas de código: flechas para cambiar, Astro con client:load en un interactivo", async ({
	page,
}) => {
	await page.goto("/components/button-group/");
	await hydrated(page, "[data-code-tabs]");
	const tabs = page.locator("[data-code-tabs]").getByRole("tab");
	const next = tabs.nth(0);
	const astro = tabs.nth(1);
	await next.focus();
	await page.keyboard.press("ArrowRight");
	await expect(astro).toBeFocused();
	await expect(astro).toHaveAttribute("aria-selected", "true");
	await expect(next).toHaveAttribute("tabindex", "-1");
	const panel = page.locator("[data-code-tabs]").getByRole("tabpanel");
	await expect(panel).toHaveCount(1);
	await expect(panel).toContainText("<ButtonGroup client:load");
	await page.keyboard.press("ArrowRight");
	await expect(next).toBeFocused();
	await expect(panel).toContainText("export default function Page()");
	await page.keyboard.press("ArrowLeft");
	await expect(astro).toHaveAttribute("aria-selected", "true");
});

test("los estáticos no llevan directiva en Astro y avisan si necesitan una función", async ({ page }) => {
	await page.goto("/components/badge/");
	await hydrated(page, "[data-code-tabs]");
	await page.locator("[data-code-tabs]").getByRole("tab", { name: "Astro" }).click();
	const panel = page.locator("[data-code-tabs]").getByRole("tabpanel");
	await expect(panel).not.toContainText("client:");
	await expect(page.locator("section[aria-labelledby=codigo]")).toContainText("onRemove");
});

test("Button: migas con su grupo, importación, índice, relacionados y anterior/siguiente (Button.dc.html)", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/components/button/");
	const crumbs = page.getByRole("navigation", { name: /migas/i });
	await expect(crumbs.getByRole("link", { name: "Componentes" })).toHaveAttribute("href", "/components/");
	await expect(crumbs.getByRole("link", { name: "Acciones" })).toHaveAttribute(
		"href",
		"/components/#acciones",
	);
	await expect(page.locator("header dl")).toContainText('import { Button } from "@jotis-me/react"');
	const headings = await page.locator("article h2").allTextContents();
	expect(headings.slice(0, 6)).toEqual([
		"Ejemplo interactivo",
		"Cuándo usarlo",
		"Variantes y estados",
		"Props",
		"Código",
		"Detalles y accesibilidad",
	]);
	const toc = page.getByRole("navigation", { name: "En esta página" }).last();
	await expect(toc.getByRole("link", { name: "Props" })).toHaveAttribute("href", "#props");
	for (const [name, slug] of [
		["ButtonGroup", "button-group"],
		["CloseButton", "close-button"],
	])
		await expect(toc.getByRole("link", { name, exact: true })).toHaveAttribute(
			"href",
			`/components/${slug}/`,
		);
	const pager = page.getByRole("navigation", { name: "Anterior y siguiente" });
	await expect(pager.getByRole("link")).toHaveCount(1);
	await expect(pager.getByRole("link", { name: /Siguiente\s*ButtonGroup/ })).toHaveAttribute(
		"href",
		"/components/button-group/",
	);
	// En Stream, las migas empiezan por Stream y anterior/siguiente no salen de la sección
	await page.goto("/components/stream-alert/");
	await expect(page.getByRole("navigation", { name: /migas/i }).getByRole("link").first()).toHaveText(
		"Stream",
	);
	await expect(page.getByRole("navigation", { name: "Anterior y siguiente" }).getByRole("link")).toHaveText(
		/StreamScene/,
	);
});

test("a 390px ninguna página de componente se desplaza en horizontal: la tabla de props va en su caja", async ({
	page,
}) => {
	test.setTimeout(180_000);
	await page.setViewportSize({ width: 390, height: 844 });
	const wide: string[] = [];
	for (const { slug } of pages) {
		await page.goto(`/components/${slug}/`);
		if ((await page.evaluate(() => document.documentElement.scrollWidth)) > 390) wide.push(slug);
	}
	expect(wide).toEqual([]);
	await expect(page.getByRole("region", { name: /^Props de / })).toHaveAttribute("tabindex", "0");
});

test("/components/ lista todos los componentes del catálogo, cada uno enlazado a su página, con las anclas de sus grupos", async ({
	page,
}) => {
	await page.goto("/components/");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Componentes");
	const index = page.locator("article");
	const links = index.locator("[data-group] a");
	await expect(links).toHaveCount(pages.length);
	for (const { slug, name } of pages) {
		const link = index.locator(`[data-group] a[href="/components/${slug}/"]`);
		await expect(link).toHaveCount(1);
		await expect(link.locator("span").first()).toHaveText(name);
	}
	// Las migas de cada página apuntan a estas anclas (/components/#acciones)
	for (const id of ["acciones", "formularios", "stream-escenas", "stream-canal"])
		await expect(page.locator(`h3#${id}`)).toHaveCount(1);
	await expect(page.locator("#seccion-stream + section h3")).toHaveText(/Alertas/);
});

test("/components/: cada card lleva su foto, la de claro o la de oscuro según el tema", async ({
	page,
	request,
}) => {
	await page.goto("/components/");
	// La foto va fuera del enlace, en la misma card (el enlace cubre toda la card con su ::after)
	const card = page.locator(`[data-group] li:has(> a[href="/components/button-group/"])`);
	const link = card.locator("> a");
	const light = card.locator(`img[src="/components/previews/ButtonGroup-light.webp"]`);
	const dark = card.locator(`img[src="/components/previews/ButtonGroup-dark.webp"]`);
	await card.scrollIntoViewIfNeeded();
	await expect(light).toBeVisible();
	await expect(dark).toBeHidden();
	// Decorativa: el nombre de la card sigue siendo solo el del componente y su descripción
	await expect(light).toHaveAttribute("alt", "");
	await expect(link).toHaveAccessibleName(/^ButtonGroup Grupo segmentado/);
	await expect.poll(() => light.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
	expect(
		(await request.get("/components/previews/StreamScene-dark.webp")).headers()["content-type"],
	).toContain("image/webp");
	await page.emulateMedia({ colorScheme: "dark" });
	await page.reload();
	await card.scrollIntoViewIfNeeded();
	await expect(dark).toBeVisible();
	await expect(light).toBeHidden();
	// Las fotos van con lazy: al cargar solo se piden las de la vista
	// Seis cards ya van en vivo, sin foto (prueba de la tarea 2.4; la 3.1 las pasa todas y este test se reescribe)
	expect(await page.locator("[data-group] img[loading=lazy]").count()).toBe((pages.length - 6) * 2);
});

test("/components/: la card enseña la muestra del componente, sobre el damero", async ({ page }) => {
	await page.goto("/components/");
	const preview = page.locator('[data-live-preview="Button"]');
	await preview.scrollIntoViewIfNeeded();
	// Su muestra (un botón), no el ejemplo del registro con todas las jerarquías y tamaños
	await expect(preview.locator("button")).toHaveCount(1);
	await expect(preview.locator("button")).toHaveText("Nuevo gasto");
	// El damero sutil de fondo (design D4)
	expect(await preview.evaluate((el) => getComputedStyle(el).backgroundImage)).toContain("linear-gradient");
});
