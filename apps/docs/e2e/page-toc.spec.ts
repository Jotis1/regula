// «En esta página» (design D1 de redesign-docs-site-v2): Tabs vertical `line` con `href` de ancla, a la derecha y
// pegada arriba al desplazarse, que marca con `aria-current="location"` la sección que se lee. En móvil no se pinta.
import { expect, type Page, test } from "@playwright/test";

const toc = (page: Page) => page.getByRole("navigation", { name: "En esta página" });

// Un solo h1 (el del PageHeader) y las secciones en h2 (el SectionHeader del paquete), en las páginas con el esqueleto
for (const path of [
	"/components/button/",
	"/foundations/color/",
	"/start/install/",
	"/changelog/",
	"/components/",
	"/icons/",
])
	test(`${path} tiene un solo h1 y sus secciones en h2`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator("main h1")).toHaveCount(1);
		// Las galerías de iconos no llevan secciones propias: solo cabecera
		if (path !== "/icons/") expect(await page.locator("main h2").count()).toBeGreaterThan(0);
		// Ningún h3 antes del primer h2
		const levels = await page.locator("main h2, main h3").evaluateAll((hs) => hs.map((h) => h.tagName));
		expect(levels[0] === "H3").toBe(false);
	});

test.describe("escritorio", () => {
	test.use({ viewport: { width: 1440, height: 900 } });

	test("es una nav de enlaces de ancla, sin pestañas, a la derecha del contenido", async ({ page }) => {
		await page.goto("/components/button/");
		await expect(toc(page)).toBeVisible();
		await expect(toc(page).getByRole("tab")).toHaveCount(0);
		await expect(page.getByRole("tablist", { name: "En esta página" })).toHaveCount(0);
		const links = toc(page).getByRole("link");
		expect(
			await links.evaluateAll((as) => as.every((a) => a.getAttribute("href")?.startsWith("#"))),
		).toBe(true);
		const article = await page.locator("article").boundingBox();
		const box = await toc(page).boundingBox();
		expect(box?.x).toBeGreaterThan((article?.x ?? 0) + (article?.width ?? 0));
		// Arriba del todo, marcada la primera sección
		await expect(toc(page).locator("[aria-current]")).toHaveCount(1);
		await expect(links.first()).toHaveAttribute("aria-current", "location");
	});

	test("al bajar hasta «Props» lo marca, y solo a él", async ({ page }) => {
		await page.goto("/components/button/");
		await page.evaluate(() => document.getElementById("props")?.scrollIntoView({ block: "start" }));
		const props = toc(page).getByRole("link", { name: "Props", exact: true });
		await expect(props).toHaveAttribute("aria-current", "location");
		await expect(toc(page).locator("[aria-current]")).toHaveCount(1);
		// Más abajo cambia la marca, sin dejar la anterior
		await page.evaluate(() => document.getElementById("codigo")?.scrollIntoView({ block: "start" }));
		await expect(toc(page).getByRole("link", { name: "Código", exact: true })).toHaveAttribute(
			"aria-current",
			"location",
		);
		await expect(props).not.toHaveAttribute("aria-current", /.*/);
	});

	test("se queda pegado arriba al desplazarse", async ({ page }) => {
		await page.goto("/components/button/");
		const column = page.locator("[data-toc]");
		const before = await column.boundingBox();
		await page.evaluate(() => scrollTo(0, 1200));
		await expect.poll(async () => (await column.boundingBox())?.y).toBeLessThan(40);
		expect(before?.y).toBeGreaterThan(40);
	});

	test("pulsar un enlace lleva a su sección y la marca", async ({ page }) => {
		await page.goto("/foundations/content/");
		await toc(page).getByRole("link", { name: "Reglas de escritura" }).click();
		await expect(page).toHaveURL(/#reglas-de-escritura$/);
		await expect(toc(page).getByRole("link", { name: "Reglas de escritura" })).toHaveAttribute(
			"aria-current",
			"location",
		);
	});
});

test.describe("móvil", () => {
	test.use({ viewport: { width: 390, height: 844 } });

	for (const path of ["/components/button/", "/foundations/color/"])
		test(`${path} no pinta el índice ni su desplegable`, async ({ page }) => {
			await page.goto(path);
			await expect(toc(page)).toBeHidden();
			await expect(
				page.getByText("En esta página", { exact: true }).locator("visible=true"),
			).toHaveCount(0);
		});
});
