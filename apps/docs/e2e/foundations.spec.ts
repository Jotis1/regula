import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { FOUNDATIONS } from "../src/lib/catalog";
import { nav } from "../src/nav";

// Las páginas de fundamentos son la fuente de la guía (design D6: de ellas sale también el README del artefacto).
// Cada una tiene su entrada en la navegación y se abre con su título; la instalación con Tailwind v4 vive en /start/.
const dir = join(import.meta.dirname, "../src/content/foundations");
const files = readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
const title = (f: string) => readFileSync(join(dir, f), "utf8").match(/^title: "([^"]+)"/m)?.[1] ?? f;
const pages: Record<string, string> = {
	...Object.fromEntries(files.map((f) => [title(f), `/foundations/${f.replace(/\.mdx?$/, "")}/`])),
	Instalación: "/start/install/",
};

test("cada página de fundamentos está en el catálogo y en la navegación", () => {
	// Stream tiene su propia sección en la cabecera, pero su página vive en /foundations/stream/
	const slugs = [...FOUNDATIONS.map((f) => f.slug), "stream"];
	expect(files.map((f) => f.replace(/\.mdx?$/, "")).sort()).toEqual(slugs.sort());
	const linked = nav.flatMap((s) => s.items.map((i) => i.href));
	for (const href of Object.values(pages)) expect(linked).toContain(href);
});

for (const [section, href] of Object.entries(pages)) {
	test(`«${section}» se abre en ${href}`, async ({ page }) => {
		const res = await page.goto(href);
		expect(res?.status()).toBe(200);
		await expect(page.locator("h1")).toBeVisible();
		await expect(page.locator(`nav[aria-label="Documentación"] a[href="${href}"]`)).toHaveAttribute(
			"aria-current",
			"page",
		);
	});
}

// URLs del rediseño, sin redirecciones (proposal): las antiguas dejan de existir
for (const old of ["/usage/tailwind/", "/foundations/spacing/", "/foundations/shadows/"]) {
	test(`la URL antigua ${old} ya no existe`, async ({ page }) => {
		const res = await page.goto(old);
		expect(res?.status()).toBe(404);
	});
}

test("el texto de la guía sale tal cual", async ({ page }) => {
	await page.goto("/foundations/content/");
	// En «En lugar de» va dos veces, tabla en escritorio y tarjetas en móvil: una se ve
	await expect(page.getByText('"Aún no hay gastos. Qué calma."').filter({ visible: true })).toHaveCount(1);
	await page.goto("/foundations/color/");
	await expect(page.getByText("Las series usan, en este orden")).toBeVisible();
	await page.goto("/foundations/stream/");
	await expect(page.getByText('"En directo" no va en rojo')).toBeVisible();
});

test("contenido y tono: la voz, las reglas de formato y los ejemplos de la guía", async ({ page }) => {
	await page.goto("/foundations/content/");
	const main = page.locator("main");
	await expect(main).toContainText("Voz: cercana, desenfadada y con humor seco.");
	await expect(main).toContainText("Castellano de España, tuteo, frases cortas.");
	await expect(main).toContainText(
		'Mayúscula solo al principio: "Nuevo movimiento", no "Nuevo Movimiento".',
	);
	await expect(main).toContainText("Cifras con formato español: 1.284,50 €, fechas 29 oct 2026.");
	const instead = page.getByRole("table", { name: /lo que se evita y lo que se escribe/ });
	await expect(instead.getByRole("row", { name: /Error leve/ })).toContainText(
		'"Se ha producido un error de validación."',
	);
	await expect(page.getByRole("heading", { name: "Aún no hay gastos" })).toBeVisible();
});

test("las páginas de fundamentos llevan migas, índice y anterior/siguiente", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/foundations/color/");
	const crumbs = page.getByRole("navigation", { name: "Migas de pan" });
	await expect(crumbs.getByRole("link", { name: "Fundamentos" })).toHaveAttribute(
		"href",
		"/foundations/principles/",
	);
	await expect(crumbs).toContainText("Color");
	const pager = page.getByRole("navigation", { name: "Anterior y siguiente" });
	await expect(pager.getByRole("link", { name: /Anterior\s*Contenido y tono/ })).toHaveAttribute(
		"href",
		"/foundations/content/",
	);
	await expect(pager.getByRole("link", { name: /Siguiente\s*Tipografía/ })).toHaveAttribute(
		"href",
		"/foundations/typography/",
	);

	await page.goto("/foundations/content/");
	const toc = page.getByRole("navigation", { name: "En esta página" });
	await expect(toc.locator("[data-toc-link]")).toHaveText([
		"La voz",
		"Dónde cabe el humor",
		"En lugar de esto, esto otro",
		"Reglas de escritura",
		"Cifras y fechas",
	]);
	await expect(toc.getByRole("link", { name: "La voz" })).toHaveAttribute("aria-current", "true");
	await page.evaluate(() =>
		document.getElementById("reglas-de-escritura")?.scrollIntoView({ block: "start" }),
	);
	await expect(toc.getByRole("link", { name: "Reglas de escritura" })).toHaveAttribute(
		"aria-current",
		"true",
	);
	await expect(toc.getByRole("link", { name: "La voz" })).toHaveAttribute("aria-current", "false");
	// Al final de la página se marca la última, aunque su título no llegue arriba
	await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
	await expect(toc.getByRole("link", { name: "Cifras y fechas" })).toHaveAttribute("aria-current", "true");
	await expect(page.getByRole("link", { name: "Proponer un cambio" })).toHaveAttribute(
		"href",
		"https://github.com/Jotis1/regula/edit/main/apps/docs/src/content/foundations/content.mdx",
	);
});

// Un texto clave de la guía por apartado: cada página lo lleva tal cual, aunque vaya en otra pieza
for (const [href, text] of [
	["/foundations/principles/", "Si una pantalla tiene más de dos o tres manchas de marca, sobra alguna."],
	["/foundations/typography/", "No uses bold en display."],
	["/foundations/layout/", "pills, avatares, toggles."],
	["/foundations/states/", "Deshabilitado: 50% de opacidad en todo el control."],
	["/foundations/iconography/", "Nunca emojis como iconos."],
	["/foundations/backgrounds/", "Uno o dos por vista, nunca en pantallas de trabajo."],
	["/foundations/brand/", "el icono identifica la app, no la tiñe."],
	["/foundations/stream/", "la cuenta atrás y las barras solo cambian cuando cambia el dato."],
	["/start/install/", "y con él los iconos de línea de @untitledui/icons."],
] as const) {
	test(`${href} lleva el texto de la guía`, async ({ page }) => {
		await page.goto(href);
		await expect(page.locator("main")).toContainText(text);
	});
}

test("la instalación va en Empezar, antes de los principios", async ({ page }) => {
	await page.goto("/start/install/");
	await expect(page.getByRole("navigation", { name: "Migas de pan" })).toContainText("Empezar");
	const pager = page.getByRole("navigation", { name: "Anterior y siguiente" });
	await expect(pager.getByRole("link", { name: /Anterior\s*Qué es Regula/ })).toHaveAttribute("href", "/");
	await expect(pager.getByRole("link", { name: /Siguiente\s*Principios/ })).toHaveAttribute(
		"href",
		"/foundations/principles/",
	);
});

test("la página de marca tiene a Regula en fuchsia y la nota de la variante Claro", async ({ page }) => {
	await page.goto("/foundations/brand/");
	const row = page.getByRole("row", { name: /Regula/ });
	await expect(row).toContainText("Re");
	await expect(row).toContainText("fuchsia");
	await expect(page.getByText("Contrastes del icono de Regula", { exact: false })).toBeVisible();
	await expect(page.getByText("blanco sobre 600 (sólido), 4,7:1", { exact: false })).toBeVisible();
	await expect(page.getByText("la variante Claro en el tema claro", { exact: false })).toBeVisible();
	await expect(page.getByText("chartreuse", { exact: false })).toHaveCount(0);
});

test("Color lleva el índice «En esta página» en columna, como el resto de fundamentos", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/foundations/color/");
	const toc = page.getByRole("navigation", { name: "En esta página" });
	await expect(toc).toHaveCount(1);
	await expect(toc).toBeVisible();
	await expect(toc.getByText("En esta página", { exact: true })).toBeVisible();
	await expect(toc.getByRole("link", { name: "Proponer un cambio" })).toBeVisible();
	const article = await page.locator("article").boundingBox();
	const column = await toc.boundingBox();
	expect(column && article && column.x).toBeGreaterThan((article?.x ?? 0) + (article?.width ?? 0));
});

test("anterior y siguiente llevan su flecha, sin cambiar el nombre accesible", async ({ page }) => {
	await page.goto("/foundations/color/");
	const pager = page.getByRole("navigation", { name: "Anterior y siguiente" });
	const prev = pager.getByRole("link", { name: "Anterior Contenido y tono" });
	const next = pager.getByRole("link", { name: "Siguiente Tipografía" });
	await expect(prev.locator('svg[aria-hidden="true"]')).toHaveCount(1);
	await expect(next.locator('svg[aria-hidden="true"]')).toHaveCount(1);
});

// Todas las páginas de fundamentos e instalación tienen índice, aunque sea de una sección, y las tablas de tokens
// del final (espaciado, sombras, tipografía) entran en él
const tocs: [string, string[]][] = [
	["/start/install/", ["Next.js (App Router)", "Astro", "Nombres de las utilidades", "Sin Tailwind"]],
	["/foundations/principles/", ["Los cuatro principios"]],
	["/foundations/layout/", ["Lo esencial", "Escala de espaciado", "Radios", "Anchos"]],
	["/foundations/states/", ["Lo esencial", "Sombras", "Desenfoques"]],
	["/foundations/iconography/", ["Lo esencial"]],
	["/foundations/backgrounds/", ["Lo esencial"]],
];
for (const [path, sections] of tocs)
	test(`${path} tiene su índice «En esta página» y cada enlace lleva a su sección`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto(path);
		const links = page.getByRole("navigation", { name: "En esta página" }).locator("[data-toc-link]");
		await expect(links).toHaveText(sections);
		for (const id of await links.evaluateAll((as) => as.map((a) => a.getAttribute("data-toc-link"))))
			await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
	});

test("la instalación usa el CodeSnippet de @jotis-me/react, con su resaltado, y no el de Astro", async ({
	page,
}) => {
	await page.goto("/start/install/");
	await expect(page.locator(".astro-code")).toHaveCount(0);
	const blocks = page.locator("[data-code]");
	await expect(blocks).toHaveCount(4);
	await expect(blocks.first().getByRole("button", { name: "Copiar código" })).toBeVisible();
	// La palabra clave `import` de la hoja va en el color de la ficha (utility-pink-600)
	await expect(blocks.nth(1).locator("span.text-utility-pink-600").first()).toHaveText("import");
});
