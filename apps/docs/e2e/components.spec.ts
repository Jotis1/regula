// Páginas de componente: ficha, ejemplos vivos, props, fragmentos de código y navegación.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { COMPONENT_GROUPS, groupOf, labelOf } from "../src/lib/catalog";

/** El bloque de código (CodeSnippet) es una isla `client:visible`: sus pestañas responden después de hidratarse. */
async function hydrated(page: Page, selector: string) {
	const island = page.locator(`${selector} astro-island`);
	await island.scrollIntoViewIfNeeded();
	await expect(island).not.toHaveAttribute("ssr", /.*/);
}

const dir = join(import.meta.dirname, "../src/content/components");
const pages = readdirSync(dir)
	.map((f) => ({
		slug: f.replace(/\.md$/, ""),
		name: (readFileSync(join(dir, f), "utf8").match(/^name: (.+)$/m) as RegExpMatchArray)[1] as string,
	}))
	.map((p) => ({ ...p, label: labelOf(p.name) }));

// El lateral lleva el árbol de su sección: Componentes y Stream se reparten las páginas
for (const [section, start] of [
	["components", "/components/button/"],
	["stream", "/components/stream-scene/"],
] as const)
	test(`la navegación lateral de ${section} lista sus páginas de componente`, async ({ page }) => {
		await page.goto(start);
		const nav = page.getByRole("navigation", { name: "Documentación" });
		const own = pages.filter((p) => groupOf(p.name)?.section === section);
		expect(own.length).toBeGreaterThan(0);
		for (const { label, slug } of own)
			await expect(
				nav.getByRole("link", { name: label, exact: true, includeHidden: true }),
			).toHaveAttribute("href", `/components/${slug}/`);
	});

for (const { slug, name, label } of pages) {
	test(`${name}: ficha, ejemplos vivos, props y código`, async ({ page }) => {
		await page.goto(`/components/${slug}/`);
		// La primera: el ejemplo de PageHeader pinta su propio <h1>. Se lee «Code snippet», no «CodeSnippet»
		await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(label);
		await expect(page.getByRole("link", { name: label, exact: true })).toHaveAttribute(
			"aria-current",
			"page",
		);
		// El ejemplo interactivo se hidrata al verse: después pinta el componente
		const example = page.locator("section[aria-labelledby=ejemplo]");
		await example.scrollIntoViewIfNeeded();
		await expect(example.locator("astro-island").first()).not.toHaveAttribute("ssr", /.*/);
		await expect(example.locator("[data-playground-preview]")).toBeVisible();
		expect(await page.locator("section[aria-labelledby=props] tbody tr").count()).toBeGreaterThan(0);
		const code = page.locator("[data-code-tabs]");
		await expect(code.getByRole("tabpanel")).toContainText(`import { ${name} } from "@jotis-me/react";`);
	});
}

test("los ejemplos vivos no heredan los estilos del texto largo (tablas, listas, párrafos)", async ({
	page,
}) => {
	await page.goto("/components/date-picker/");
	const grid = page.locator("[data-playground-preview] table").first();
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
	// El ejemplo interactivo va en una caja `not-prose`: ni listas ni párrafos del texto largo llegan a él
	await page.goto("/components/text-editor/");
	await expect(page.locator("section[aria-labelledby=ejemplo] [data-playground-preview]")).toBeVisible();
	expect(
		await page
			.locator("[data-playground-preview]")
			.evaluate((el) => !!el.closest(".not-prose") || !el.closest(".prose")),
	).toBe(true);
});

test("Button: su ejemplo es un botón de 40px, la regla de una primaria y sus props", async ({ page }) => {
	await page.goto("/components/button/");
	const preview = page.locator("[data-playground-preview]");
	await expect(preview.getByRole("button", { name: "Nuevo gasto" })).toHaveCSS("height", "40px");
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

test("TransparencyGrid: los cuadros usan los colores del tema, en claro y en oscuro", async ({ page }) => {
	const read = async (scheme: "light" | "dark") => {
		await page.emulateMedia({ colorScheme: scheme });
		await page.goto("/components/transparency-grid/");
		// El primer damero de la caja de ejemplos: el que lleva el texto «Cuadros de 8px»
		const grid = page.locator("[data-playground-preview] > div:last-child > *").first();
		await expect(grid).toBeVisible();
		return grid.evaluate((el) => {
			// El color real de cada token en este tema, medido con un elemento de prueba dentro del propio damero
			const probe = (token: string) => {
				const p = document.createElement("div");
				p.style.background = `var(${token})`;
				el.appendChild(p);
				const color = getComputedStyle(p).backgroundColor;
				p.remove();
				return color;
			};
			const style = getComputedStyle(el);
			return {
				bg: style.backgroundColor,
				image: style.backgroundImage,
				primary: probe("--bg-primary"),
				secondary: probe("--bg-secondary"),
			};
		});
	};
	const light = await read("light");
	const dark = await read("dark");
	for (const theme of [light, dark]) {
		expect(theme.bg).toBe(theme.primary);
		expect(theme.image).toContain("linear-gradient");
		expect(theme.image).toContain(theme.secondary);
	}
	expect(dark.primary).not.toBe(light.primary);
	expect(dark.secondary).not.toBe(light.secondary);
});

test("Dropdown: la tabla de props lleva la elección y el check de la elegida no se queda en el gris de los iconos", async ({
	page,
}) => {
	await page.goto("/components/dropdown/");
	const props = page.getByRole("region", { name: "Props de Dropdown" });
	await expect(props).toContainText("selectedValue");
	await expect(props).toContainText("onSelectionChange");
	// Los ejemplos del registro (el menú de tema, el de cuentas) están en su página de comparación
	await page.goto("/visual/dropdown/");
	const examples = page.locator("body > astro-island");
	await expect(examples).not.toHaveAttribute("ssr", /.*/);
	// El menú de tema (el de elección única); el de cuentas también marca una con su radio
	const checked = examples
		.getByRole("menu", { name: "Tema" })
		.locator('[role="menuitemradio"][aria-checked="true"]');
	await expect(checked).toHaveCount(1);
	const color = (svg: Locator) => svg.evaluate((el) => getComputedStyle(el).color);
	// El primer icono es el de la opción (gris, fg-quaternary) y el último el check (de marca)
	expect(await color(checked.locator("svg").last())).not.toBe(await color(checked.locator("svg").first()));
});

test("CommandMenu: con el foco en el buscador, la opción activa lleva el anillo de foco; sin foco, solo el fondo", async ({
	page,
}) => {
	await page.goto("/visual/command-menu/");
	const examples = page.locator("body > astro-island");
	await expect(examples).not.toHaveAttribute("ssr", /.*/);
	const search = examples.getByRole("combobox").first();
	const active = examples.locator('[role="option"][aria-selected="true"]').first();
	const ring = () => active.evaluate((el) => getComputedStyle(el).boxShadow);
	expect(await ring()).toBe("none");
	await search.focus();
	await expect.poll(ring).toContain("rgb(97, 95, 255)"); // focus-ring #615FFF
	await search.blur();
	await expect.poll(ring).toBe("none");
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
	// La importación, en un campo de solo lectura con su botón de copiar (PageHeader, design D1)
	const importLine = page.locator("main header").first().getByRole("textbox", { name: "Importación" });
	await expect(importLine).toHaveValue('import { Button } from "@jotis-me/react"');
	await expect(importLine).toHaveAttribute("readonly", "");
	await expect(page.locator("main header").first().getByRole("button", { name: "Copiar" })).toBeVisible();
	const headings = await page.locator("article h2").allTextContents();
	expect(headings.slice(0, 7)).toEqual([
		"Ejemplo interactivo",
		"Cuándo usarlo",
		"Evita",
		"Props",
		"Código",
		"Detalles y accesibilidad",
		"Relacionados",
	]);
	const toc = page.getByRole("navigation", { name: "En esta página" });
	await expect(toc.getByRole("link", { name: "Props" })).toHaveAttribute("href", "#props");
	// Relacionados, al final de la página: los tres siguientes de su grupo en `LinkCard`, con su descripción
	const related = page.getByRole("navigation", { name: "Relacionados" });
	await expect(related.getByRole("link")).toHaveCount(3);
	for (const [name, slug] of [
		["Button group", "button-group"],
		["Button utility", "button-utility"],
		["Close button", "close-button"],
	])
		await expect(related.getByRole("link", { name: new RegExp(`^${name}`) })).toHaveAttribute(
			"href",
			`/components/${slug}/`,
		);
	await expect(related.getByRole("link", { name: /^Button group/ })).toContainText("Grupo segmentado");
	await expect(toc.getByRole("link", { name: "Relacionados" })).toHaveAttribute("href", "#relacionados");
	const pager = page.getByRole("navigation", { name: "Anterior y siguiente" });
	await expect(pager.getByRole("link")).toHaveCount(1);
	await expect(pager.getByRole("link", { name: /Siguiente\s*Button group/ })).toHaveAttribute(
		"href",
		"/components/button-group/",
	);
	// En Stream, las migas empiezan por Stream y anterior/siguiente no salen de la sección
	await page.goto("/components/stream-alert/");
	await expect(page.getByRole("navigation", { name: /migas/i }).getByRole("link").first()).toHaveText(
		"Stream",
	);
	await expect(page.getByRole("navigation", { name: "Anterior y siguiente" }).getByRole("link")).toHaveText(
		/Stream scene/,
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
	// Por debajo de `lg` las props son una lista plegable; la tabla, con su caja que recibe el foco, es de escritorio
	await expect(page.getByRole("list", { name: /^Props de / })).toBeVisible();
	await page.setViewportSize({ width: 1440, height: 900 });
	await expect(page.getByRole("region", { name: /^Props de / })).toHaveAttribute("tabindex", "0");
});

test("/components/ lista todos los componentes del catálogo, cada uno enlazado a su página, con las anclas de sus grupos", async ({
	page,
}) => {
	await page.goto("/components/");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Componentes");
	const index = page.locator("[data-index]");
	// El enlace de cada card (las vistas previas pueden llevar enlaces dibujados: Breadcrumbs, SidebarNav…)
	const links = index.locator("[data-group] > li > a");
	await expect(links).toHaveCount(pages.length);
	for (const { slug, label } of pages) {
		const link = index.locator(`[data-group] > li > a[href="/components/${slug}/"]`);
		await expect(link).toHaveCount(1);
		await expect(link.locator("span").first()).toHaveText(label);
	}
	// Las migas de cada página apuntan a estas anclas (/components/#acciones)
	for (const id of ["acciones", "formularios", "stream-escenas", "stream-canal"])
		await expect(page.locator(`#${id} h2`)).toHaveCount(1);
	// Los de Stream se leen con su sección delante: «Alertas» no se confunde con «Avisos y carga»
	await expect(page.locator("#stream-alertas h2")).toHaveText("Stream: Alertas");
	await expect(page.locator("#acciones")).toContainText(
		"Lo que se pulsa para que pase algo. 7 componentes.",
	);
});

// El índice (redesign-docs-site-v2, design D5 y D8): mapa de grupos, buscador, desplegable de grupo y estados
const visibleCards = (page: Page) => page.locator("[data-group] > li:visible > a");

test("/components/ · Mapa de grupos: antes de las cards hay un enlace por cada uno de los 16 grupos, con su frase y su recuento", async ({
	page,
}) => {
	await page.goto("/components/");
	const map = page.getByRole("region", { name: /^Qué necesitas hacer/ });
	const links = map.getByRole("link");
	await expect(links).toHaveCount(COMPONENT_GROUPS.length);
	expect(COMPONENT_GROUPS).toHaveLength(16);
	for (const g of COMPONENT_GROUPS) {
		const n = g.components.length;
		const link = map.locator(`a[href="#${g.id}"]`);
		await expect(link).toHaveCount(1);
		await expect(link).toContainText(g.section === "stream" ? `Stream: ${g.label}` : g.label);
		await expect(link).toContainText(`${g.description} ${n} ${n === 1 ? "componente" : "componentes"}.`);
	}
	// El mapa va antes de la primera card
	const before = await page.evaluate(() => {
		const map = document.querySelector("[data-index-map]") as Element;
		const card = document.querySelector("[data-group] > li") as Element;
		return !!(map.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING);
	});
	expect(before).toBe(true);
	// Y cada enlace lleva a su grupo
	await map.getByRole("link", { name: /^Gráficas/ }).click();
	await expect(page).toHaveURL(/\/components\/#graficas$/);
	await expect(page.locator("#graficas")).toBeInViewport();
});

test("/components/ · Buscar por lo que hace: «fecha» deja DatePicker y CalendarView y anuncia cuántos quedan", async ({
	page,
}) => {
	await page.goto("/components/");
	const search = page.getByRole("textbox", { name: "Buscar por nombre o por lo que hace" });
	const status = page.locator("[data-index-count]");
	await expect(status).toHaveAttribute("role", "status");
	await expect(status).toBeEmpty();
	await search.fill("fecha");
	await expect(visibleCards(page)).toHaveCount(2);
	expect(await visibleCards(page).evaluateAll((els) => els.map((a) => a.getAttribute("href")))).toEqual([
		"/components/date-picker/",
		"/components/calendar-view/",
	]);
	await expect(status).toHaveText(`2 de ${pages.length} componentes`);
	// Solo quedan los grupos con resultados; el mapa se aparta mientras se busca
	await expect(page.locator("[data-index-group]:visible")).toHaveCount(2);
	await expect(page.locator("[data-index-map]")).toBeHidden();
	// Por nombre (como se lee y como se escribe en el código), sin tildes ni mayúsculas, y por palabra clave
	await search.fill("DATEPICKER");
	await expect(visibleCards(page)).toHaveCount(1);
	await search.fill("boton");
	await expect(page.locator('[data-group] > li:visible > a[href="/components/button/"]')).toHaveCount(1);
	// Varias palabras: tienen que estar todas
	await search.fill("fecha rango");
	await expect(visibleCards(page)).toHaveCount(1);
	// Escape lo vacía y vuelve todo
	await search.press("Escape");
	await expect(search).toHaveValue("");
	await expect(visibleCards(page)).toHaveCount(pages.length);
	await expect(page.locator("[data-index-map]")).toBeVisible();
	await expect(status).toBeEmpty();
});

test("/components/ · Sin resultados en el índice: «botonn» enseña un estado vacío que lo nombra y «Limpiar búsqueda»", async ({
	page,
}) => {
	await page.goto("/components/");
	const search = page.getByRole("textbox", { name: "Buscar por nombre o por lo que hace" });
	const empty = page.locator("[data-index-empty]");
	await expect(empty).toBeHidden();
	await search.fill("botonn");
	await expect(visibleCards(page)).toHaveCount(0);
	await expect(empty).toBeVisible();
	await expect(empty.getByRole("heading")).toHaveText("Nada con «botonn»");
	await expect(page.locator("[data-index-count]")).toHaveText("Sin resultados");
	await empty.getByRole("button", { name: "Limpiar búsqueda" }).click();
	await expect(empty).toBeHidden();
	await expect(search).toHaveValue("");
	await expect(search).toBeFocused();
	await expect(visibleCards(page)).toHaveCount(pages.length);
});

test("/components/: el desplegable de grupo lleva al ancla del grupo, con ratón y con teclado, y su código no se pide hasta usarlo", async ({
	page,
}) => {
	const scripts: string[] = [];
	page.on("request", (r) => {
		if (r.resourceType() === "script") scripts.push(r.url());
	});
	await page.goto("/components/");
	await page.waitForLoadState("networkidle");
	const atLoad = scripts.length;
	const select = page.getByRole("button", { name: /Ir a un grupo/ });
	await expect(select).toContainText("Todos los grupos");
	// Con una búsqueda a medias, ir a un grupo la limpia: el grupo podía estar escondido
	await page.getByRole("textbox", { name: "Buscar por nombre o por lo que hace" }).fill("fecha");
	await select.click();
	const options = page.getByRole("option");
	await expect(options).toHaveCount(COMPONENT_GROUPS.length + 1);
	expect(scripts.length).toBeGreaterThan(atLoad);
	await page.getByRole("option", { name: "Stream: Canal" }).click();
	await expect(page).toHaveURL(/#stream-canal$/);
	await expect(page.locator("#stream-canal")).toBeInViewport();
	await expect(visibleCards(page)).toHaveCount(pages.length);
	// Ya montado, con teclado
	await page.getByRole("button", { name: /Ir a un grupo/ }).focus();
	await page.keyboard.press("Enter");
	await page.getByRole("option", { name: "Formularios" }).click();
	await expect(page).toHaveURL(/#formularios$/);
	await expect(page.locator("#formularios")).toBeInViewport();
});

test("/components/: con teclado y sin haberlo tocado antes, Enter abre el desplegable de grupo", async ({
	page,
}) => {
	await page.goto("/components/");
	await page.getByRole("button", { name: /Ir a un grupo/ }).focus();
	await page.keyboard.press("Enter");
	await expect(page.getByRole("listbox")).toBeVisible();
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect(page).toHaveURL(/#acciones$/);
});

test("/components/ · carga: cada captura lleva un Skeleton en su hueco hasta que carga su imagen", async ({
	page,
}) => {
	// Las capturas no llegan hasta que se suelta la espera
	let release: () => void = () => {};
	const held = new Promise<void>((resolve) => {
		release = resolve;
	});
	await page.route(/\.webp(\?|$)/, async (route) => {
		await held;
		await route.continue();
	});
	await page.goto("/components/", { waitUntil: "domcontentloaded" });
	const first = page.locator('[data-showcase-card="Button"]');
	await first.scrollIntoViewIfNeeded();
	const skeleton = first.locator("> span");
	await expect(skeleton).toBeVisible();
	await expect(skeleton).toHaveAttribute("aria-hidden", "true");
	// El texto de la card ya está: solo espera la captura
	await expect(card(page, "button").locator("> a")).toContainText("Button");
	release();
	await expect(first).toHaveAttribute("data-loaded", "");
	await expect(skeleton).toBeHidden();
	// Las tres primeras siguen sin ser perezosas: el Skeleton no cambia cómo se cargan
	await expect(first.locator("img").first()).toHaveAttribute("loading", "eager");
});

test.describe("/components/ sin JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("se ve entero y el buscador y el desplegable, que no harían nada, no se pintan", async ({
		page,
	}) => {
		await page.goto("/components/");
		await expect(visibleCards(page)).toHaveCount(pages.length);
		await expect(page.locator("[data-index-map] a")).toHaveCount(16);
		await expect(page.locator("[data-index-search] input")).toBeHidden();
		await expect(page.locator("[data-index-select]")).toBeHidden();
		await expect(page.locator("[data-index-empty]")).toBeHidden();
	});
});

// Capturas de las cards (change adopt-untitled-ui-icons): una imagen WebP por tema de lo más característico de cada componente,
// inerte y fuera del enlace, que cubre toda la card.
const card = (page: Page, slug: string) =>
	page.locator(`[data-group] > li:has(> a[href="/components/${slug}/"])`);

/** Las imágenes de una card que se ven con el tema actual (la del otro tema va con `display: none`). */
const shown = (page: Page, name: string) =>
	page
		.locator(`[data-showcase-card="${name}"] img`)
		.evaluateAll((els) =>
			els
				.filter((e) => getComputedStyle(e).display !== "none")
				.map((e) => (e as HTMLImageElement).dataset.showcaseTheme),
		);

test("/components/: la card de ButtonGroup es una captura WebP, decorativa, y su nombre se lee separado", async ({
	page,
}) => {
	await page.goto("/components/");
	const c = card(page, "button-group");
	await c.scrollIntoViewIfNeeded();
	const preview = c.locator("[data-showcase-card]");
	await expect(preview.locator("img").first()).toHaveAttribute("src", /button-group-light.*\.webp$/);
	await expect(preview).toHaveAttribute("aria-hidden", "true");
	await expect(preview).toHaveAttribute("inert", "");
	await expect(preview.locator("img").first()).toHaveAttribute("alt", "");
	// La imagen ya no es el componente montado: no hay botones dentro de la card
	await expect(preview.locator("button")).toHaveCount(0);
	await expect(page.locator("[data-group] [data-live-preview]")).toHaveCount(0);
	await expect(c.locator("> a")).toHaveAccessibleName(/^Button group Grupo segmentado/);
});

test("/components/: cada imagen reserva su hueco y casi todas son perezosas, para que la página no salte al cargarla", async ({
	page,
}) => {
	await page.goto("/components/");
	const attrs = await page.locator("[data-showcase-card] img").evaluateAll((els) =>
		els.map((e) => ({
			lazy: e.getAttribute("loading"),
			w: e.getAttribute("width"),
			h: e.getAttribute("height"),
		})),
	);
	expect(attrs.length).toBeGreaterThan(200);
	for (const a of attrs) expect({ w: a.w, h: a.h }).toEqual({ w: "800", h: "500" });
	// Todas perezosas salvo la captura clara de las tres primeras cards, que están a la vista al cargar (suele ser el LCP)
	expect(attrs.filter((a) => a.lazy === "eager")).toHaveLength(3);
	expect(attrs.filter((a) => a.lazy !== "eager" && a.lazy !== "lazy")).toEqual([]);
});

test("/components/: solo se descarga la captura del tema activo y la de las cards que se acercan a la pantalla", async ({
	page,
}) => {
	const requested: string[] = [];
	page.on("request", (r) => {
		if (/\.webp(\?|$)/.test(r.url())) requested.push(r.url());
	});
	await page.goto("/components/");
	await page.waitForLoadState("networkidle");
	expect(requested.length).toBeGreaterThan(0);
	// Con el tema claro no se pide ninguna oscura de una card de aplicación…
	expect(requested.filter((u) => /button-dark/.test(u))).toEqual([]);
	// …y no se piden las de las 120 cards a la vez: las de abajo esperan
	expect(requested.length).toBeLessThan(60);
});

test("/components/: el tema cambia las capturas sin recargar; las de Stream van siempre en oscuro", async ({
	page,
}) => {
	await page.goto("/components/");
	await expect.poll(() => shown(page, "Button")).toEqual(["light"]);
	await expect.poll(() => shown(page, "StreamAlert")).toEqual(["dark"]);
	// El selector de tema de la cabecera: se abre y se elige Oscuro
	// (una isla por versión de la cabecera, escritorio y móvil: se esperan las dos)
	const themeIslands = page.locator("body > header astro-island").filter({ hasText: "Tema:" });
	await expect(themeIslands).toHaveCount(2);
	for (const island of await themeIslands.all()) await expect(island).not.toHaveAttribute("ssr", /.*/);
	await page.getByRole("button", { name: /^Tema: / }).click();
	await page.getByRole("menuitemradio", { name: "Oscuro", exact: true }).click();
	await expect.poll(() => shown(page, "Button")).toEqual(["dark"]);
	// Stream no cambia: ya estaba en oscuro
	expect(await shown(page, "StreamAlert")).toEqual(["dark"]);
});

test("/components/: Tab va de card en card sin entrar en las capturas", async ({ page }) => {
	await page.goto("/components/");
	const first = page.locator("[data-group] > li > a").first();
	await first.focus();
	for (let i = 0; i < 12; i++) {
		const inside = await page.evaluate(() => !!document.activeElement?.closest("[data-showcase-card]"));
		expect(inside).toBe(false);
		await expect(page.locator(":focus")).toHaveAttribute("href", /^\/components\/[a-z-]+\/$/);
		await page.keyboard.press("Tab");
	}
});

test("/components/: un clic sobre la captura abre la página del componente", async ({ page }) => {
	await page.goto("/components/");
	const image = card(page, "button").locator("[data-showcase-card]");
	await image.scrollIntoViewIfNeeded();
	// La imagen no recibe el ratón (pointer-events: none): el clic llega al enlace de la card que la cubre
	const box = await image.boundingBox();
	if (!box) throw new Error("la captura no tiene caja");
	await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
	await expect(page).toHaveURL(/\/components\/button\/$/);
});

test("/components/: sin islas en las cards, sin la página de ejemplos y sin ids repetidos", async ({
	page,
}) => {
	await page.goto("/components/");
	await expect(page.locator("[data-showcase-card] astro-island")).toHaveCount(0);
	await expect(page.locator("astro-island[component-url*='VisualExample']")).toHaveCount(0);
	const repeated = await page.evaluate(() => {
		const seen = new Map<string, number>();
		for (const el of document.querySelectorAll("[id]")) seen.set(el.id, (seen.get(el.id) ?? 0) + 1);
		return [...seen].filter(([, n]) => n > 1).map(([id]) => id);
	});
	expect(repeated).toEqual([]);
});

test("/components/: todas las cards tienen su imagen y se cargan sin error", async ({ page }) => {
	test.setTimeout(120_000);
	await page.goto("/components/");
	// Se baja hasta el final para que se pidan todas las imágenes perezosas
	await page.evaluate(async () => {
		for (let y = 0; y < document.body.scrollHeight; y += 700) {
			window.scrollTo(0, y);
			await new Promise((r) => setTimeout(r, 40));
		}
	});
	await page.waitForLoadState("networkidle");
	const broken = await page.locator("[data-showcase-card]").evaluateAll((els) =>
		els
			.filter((el) => {
				const visible = [...el.querySelectorAll("img")].find(
					(i) => getComputedStyle(i).display !== "none",
				);
				return !visible?.complete || visible.naturalWidth === 0;
			})
			.map((el) => el.getAttribute("data-showcase-card")),
	);
	expect(broken).toEqual([]);
});
