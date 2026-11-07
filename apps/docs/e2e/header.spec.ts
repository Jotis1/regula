// Cabecera del rediseño (reference/docs-design/Header.dc.html): marca, secciones, búsqueda y tema.
import { expect, type Page, test } from "@playwright/test";

const header = (page: Page) => page.locator("body > header");
const sections = (page: Page) => page.getByRole("navigation", { name: "Secciones" });

test.use({ viewport: { width: 1440, height: 900 } });

test("muestra el icono de Regula y su nombre, y lleva a la portada", async ({ page }) => {
	await page.goto("/foundations/color/");
	const brand = header(page).getByRole("link", { name: "Regula, portada" });
	await expect(brand).toHaveAttribute("href", "/");
	await expect(brand).toContainText("Regula");
	await expect(brand.locator("span.font-display")).toHaveCSS("font-weight", "700");
	await expect(brand.locator("span.font-display")).toHaveCSS("font-family", /Bricolage Grotesque/);
	await expect(header(page)).not.toContainText("jotis.me");
});

// Fondo de la baldosa de Regula (fuchsia): variante Claro (50) en el tema claro, principal (950) en el oscuro
const tile = (page: Page) =>
	header(page).getByRole("link", { name: "Regula, portada" }).locator("svg:visible path").first();

test("en claro lleva la variante Claro del icono y en oscuro la principal", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	await expect(tile(page)).toHaveAttribute("fill", "#fdf4ff");
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto("/");
	await expect(tile(page)).toHaveAttribute("fill", "#4b004f");
});

test("tiene las cinco secciones en orden", async ({ page }) => {
	await page.goto("/");
	const links = sections(page).getByRole("link");
	await expect(links).toHaveText(["Empezar", "Fundamentos", "Componentes", "Stream", "Iconos"]);
	expect(await links.evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual([
		"/start/install/",
		"/foundations/principles/",
		"/components/",
		"/foundations/stream/",
		"/icons/",
	]);
});

for (const [path, current] of [
	["/start/install/", "Empezar"],
	["/foundations/color/", "Fundamentos"],
	["/components/button/", "Componentes"],
	["/components/stream-scene/", "Stream"],
	["/foundations/stream/", "Stream"],
	["/icons/", "Iconos"],
] as const) {
	test(`en ${path} marca «${current}» como sección actual`, async ({ page }) => {
		await page.goto(path);
		const marked = sections(page).locator("a[aria-current]");
		await expect(marked).toHaveCount(1);
		await expect(marked).toHaveText(current);
		await expect(marked).toHaveAttribute("aria-current", "true");
	});
}

test("en la portada no marca ninguna sección", async ({ page }) => {
	await page.goto("/");
	await expect(sections(page).locator("a[aria-current]")).toHaveCount(0);
});

test("el salto al contenido aparece con el teclado y lleva al contenido", async ({ page }) => {
	await page.goto("/foundations/color/");
	await page.keyboard.press("Tab");
	const skip = page.getByRole("link", { name: "Saltar al contenido" });
	await expect(skip).toBeFocused();
	await expect(skip).toBeInViewport();
	await expect(skip).toHaveAttribute("href", "#contenido");
	await expect(page.locator("#contenido")).toHaveCount(1);
});

test("la búsqueda tiene aspecto de campo y el selector de tema dice lo elegido", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	const search = header(page).getByRole("button", { name: /Buscar en Regula/ });
	await expect(search).toContainText("Ctrl K");
	await expect(search).toHaveAttribute("aria-keyshortcuts", "Control+K Meta+K");
	expect((await search.boundingBox())?.width).toBe(300);
	await expect(header(page).getByRole("button", { name: "Tema: Sistema" })).toBeVisible();
});

// Medidas de Header.dc.html a 1440px: alto 64, padding lateral 32, icono 28, huecos de 32 entre bloques y 24
// entre secciones, y la sección actual subrayada 2px en fg-brand-primary_alt.
test("a 1440px tiene las medidas del diseño", async ({ page }) => {
	await page.goto("/components/button/");
	const box = await header(page).boundingBox();
	expect(box?.height).toBe(64);
	expect(box?.width).toBe(1440);
	const brand = await header(page).getByRole("link", { name: "Regula, portada" }).boundingBox();
	expect(brand?.x).toBe(32);
	const icon = await header(page).locator("a[aria-label='Regula, portada'] svg:visible").boundingBox();
	expect([icon?.width, icon?.height]).toEqual([28, 28]);
	const nav = await sections(page).boundingBox();
	expect((nav?.x ?? 0) - ((brand?.x ?? 0) + (brand?.width ?? 0))).toBe(32);
	const [first, second] = await sections(page)
		.getByRole("link")
		.evaluateAll((as) => as.slice(0, 2).map((a) => a.getBoundingClientRect().toJSON()));
	expect(second.x - (first.x + first.width)).toBe(24);
	// La búsqueda va pegada al margen derecho y el tema a su izquierda, a 32px (su ancho cambia con lo elegido)
	const search = await header(page)
		.getByRole("button", { name: /Buscar en Regula/ })
		.boundingBox();
	expect(1440 - ((search?.x ?? 0) + (search?.width ?? 0))).toBe(32);
	const toggle = await header(page).getByRole("button", { name: /^Tema/ }).boundingBox();
	expect((search?.x ?? 0) - ((toggle?.x ?? 0) + (toggle?.width ?? 0))).toBe(32);
	const underline = await sections(page)
		.locator("a[aria-current]")
		.evaluate((a) => getComputedStyle(a).boxShadow);
	const brandAlt = await page.evaluate(() =>
		getComputedStyle(document.documentElement).getPropertyValue("--fg-brand-primary_alt").trim(),
	);
	expect(brandAlt).not.toBe("");
	expect(underline).toContain("inset");
	expect(underline).toMatch(/-2px/);
});

test("favicon: el icono de app de Regula, en SVG y PNG, servido como fichero", async ({ page, request }) => {
	await page.goto("/components/button/");
	const svg = await page.locator('link[rel="icon"][type="image/svg+xml"]').getAttribute("href");
	const png = await page.locator('link[rel="icon"][type="image/png"]').getAttribute("href");
	const apple = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
	expect(svg).toMatch(/^\/_astro\/regula-favicon\..+\.svg$/);
	for (const href of [svg, png, apple]) expect((await request.get(href ?? "")).ok()).toBe(true);
	expect(await (await request.get(svg ?? "")).text()).toContain("<title>Regula</title>");
});

test("el icono de la cabecera lleva la virgulilla, aunque vaya por debajo de 32px", async ({ page }) => {
	await page.goto("/");
	const logo = header(page).getByRole("link", { name: "Regula, portada" });
	await expect(logo.locator('svg:visible path[stroke-linecap="round"]')).toHaveCount(1);
});
