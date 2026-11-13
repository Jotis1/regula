import { colors, shadows, type } from "@jotis-me/tokens";
import { expect, type Page, test } from "@playwright/test";

const total = Object.keys(colors).length;
const inFamily = (prefix: string) => Object.keys(colors).filter((n) => n.startsWith(`${prefix}-`)).length;

/** El explorador de tokens de la página de color. */
const explorer = (page: Page) => page.locator("[data-tokens]");
const filter = (page: Page) => page.getByLabel("Filtrar tokens");
const families = (page: Page) => page.getByRole("navigation", { name: "Familia" });
/** La tabla de una familia (escritorio): lleva su nombre. */
const table = (page: Page, family: string) => explorer(page).getByRole("table", { name: family });
/** La fila de un token, por su nombre exacto. */
const row = (page: Page, family: string, name: string) =>
	table(page, family)
		.getByRole("row")
		.filter({
			has: page.locator("[data-layout=row] > span:first-child").getByText(name, { exact: true }),
		});
/** Las tarjetas a la vista (móvil). */
const cards = (page: Page) => explorer(page).locator("[data-layout=card]:visible");
/** La burbuja de copiar es una isla `client:idle`: hasta que se hidrata, un clic no copia. */
const copyReady = (page: Page) =>
	expect(
		page.locator("astro-island").filter({ has: page.locator("[data-copy-tooltip]") }),
	).not.toHaveAttribute("ssr", /.*/);

test("la página de color tiene una fila y una tarjeta por token del paquete, sin islas", async ({ page }) => {
	await page.goto("/foundations/color/");
	await expect(explorer(page).locator("[data-layout=row]")).toHaveCount(total);
	await expect(explorer(page).locator("[data-layout=card]")).toHaveCount(total);
	await expect(explorer(page).locator("astro-island")).toHaveCount(0);
	// Se abre por Texto: solo su tabla está a la vista
	await expect(explorer(page).locator("tbody tr:visible")).toHaveCount(inFamily("text"));
	await expect(
		table(page, "Texto").getByRole("button", { name: "text-primary", exact: true }),
	).toBeVisible();
});

test("pulsar la utilidad de un token la copia y lo confirma", async ({ page, context }) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/foundations/color/");
	await copyReady(page);
	await families(page)
		.getByRole("link", { name: /^Fondos/ })
		.click();
	await table(page, "Fondos").getByRole("button", { name: "bg-brand-solid", exact: true }).click();
	// Dice solo «Copiado», sin repetir el valor (uno largo desbordaría el aviso)
	await expect(page.locator("[data-copy-tooltip]")).toHaveText("Copiado");
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("bg-brand-solid");
	// Un icono copia su utilidad de Tailwind, no su nombre
	await families(page)
		.getByRole("link", { name: /^Iconos/ })
		.click();
	await table(page, "Iconos").getByRole("button", { name: "text-fg-quaternary", exact: true }).click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("text-fg-quaternary");
});

for (const [path, sample] of [
	["/foundations/typography/", "Copiar display-sm-semibold"],
	["/foundations/layout/", "Copiar rounded-lg"],
	["/foundations/states/", "Copiar shadow-xs-skeuomorphic"],
] as const) {
	test(`${path} se genera desde los tokens`, async ({ page }) => {
		await page.goto(path);
		await expect(page.getByRole("button", { name: sample, exact: true })).toBeVisible();
	});

	test(`${path} a 390 px es una tarjeta por token, sin desplazamiento horizontal`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(path);
		await expect(page.getByRole("button", { name: sample, exact: true })).toBeVisible();
		await expect(page.locator("[data-token-cards]").first()).toBeVisible();
		await expect(page.locator("article table:visible")).toHaveCount(0);
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			),
		).toBe(0);
	});
}

test("cada muestra de tipografía se pinta con el tamaño, interlineado y peso de su token", async ({
	page,
}) => {
	await page.goto("/foundations/typography/");
	const shown = await page.locator("table button[data-copy]").evaluateAll((buttons) =>
		buttons.map((b) => {
			const cs = getComputedStyle(b.nextElementSibling as Element);
			return `${b.textContent?.trim()} ${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight}`;
		}),
	);
	const expected = type.groups.flatMap((g) =>
		g.styles.map((s) => `${s.name} ${s.fontSize}/${s.lineHeight} ${s.fontWeight}`),
	);
	expect(shown).toEqual(expected);
});

test("cada muestra de sombra tiene la sombra de su token", async ({ page }) => {
	await page.goto("/foundations/states/");
	const none = await page
		.locator("table .shadow-sample")
		.evaluateAll((spans) =>
			spans
				.filter((s) => getComputedStyle(s).boxShadow === "none")
				.map((s) => s.closest("tr")?.querySelector("button")?.textContent),
		);
	expect(none).toEqual([]);
	await expect(page.locator("table .shadow-sample")).toHaveCount(Object.keys(shadows).length);
});

test("las notas de uso salen en castellano", async ({ page }) => {
	await page.goto("/foundations/color/");
	await expect(
		table(page, "Texto").getByText("Texto y titulares sobre bg-primary, bg-secondary y bg-tertiary."),
	).toBeVisible();
	await expect(page.getByText("Body copy and headings")).toHaveCount(0);
});

test("las URLs van en inglés", async ({ page }) => {
	// La portada va sin navegación lateral y el lateral solo lleva su sección: se mira en la de Componentes
	await page.goto("/components/button/");
	const hrefs = await page
		.locator("aside nav a")
		.evaluateAll((as) => as.map((a) => a.getAttribute("href")));
	expect(hrefs.length).toBeGreaterThan(80);
	for (const href of hrefs) expect(href).toMatch(/^\/((start|foundations|icons|components)\/.*)?$/);
});

test.describe("explorador de tokens de Color", () => {
	test("Filtrar: «placeholder» deja text-placeholder con sus dos valores y su nota", async ({ page }) => {
		await page.goto("/foundations/color/");
		await filter(page).fill("placeholder");
		const visible = explorer(page).locator("tbody tr:visible");
		await expect(visible).toHaveCount(1);
		const swatch = visible.locator("[data-layout=row]");
		await expect(swatch.locator("> span:first-child")).toHaveText("text-placeholder");
		await expect(swatch.locator("[data-theme-swatch=light]")).toContainText(
			colors["text-placeholder"].light,
		);
		await expect(swatch.locator("[data-theme-swatch=dark]")).toContainText(
			colors["text-placeholder"].dark,
		);
		await expect(visible).toContainText(colors["text-placeholder"].usage);
		// El recuento se anuncia, y cada familia dice cuántos tiene con eso
		await expect(explorer(page).getByRole("status")).toHaveText(
			`1 de ${inFamily("text")} tokens de Texto con «placeholder»`,
		);
		await expect(explorer(page).getByRole("status")).toHaveAttribute("aria-live", "polite");
		await expect(families(page).getByRole("link", { name: /^Texto\s*1$/ })).toBeVisible();
		await expect(families(page).getByRole("link", { name: /^Fondos\s*0$/ })).toBeVisible();
	});

	test("filtra también por valor y por uso, sin tildes", async ({ page }) => {
		await page.goto("/foundations/color/");
		await families(page)
			.getByRole("link", { name: /^Fondos/ })
			.click();
		await filter(page).fill(colors["bg-brand-solid"].light);
		await expect(row(page, "Fondos", "bg-brand-solid")).toBeVisible();
		await filter(page).fill("PAGINA");
		await expect(row(page, "Fondos", "bg-primary")).toBeVisible();
		await expect(row(page, "Fondos", "bg-brand-solid")).toBeHidden();
	});

	test("elige la familia con las pestañas, con su recuento, y el enlace a una familia la abre", async ({
		page,
	}) => {
		await page.goto("/foundations/color/");
		const visible = explorer(page).locator("tbody tr:visible");
		const icons = families(page).getByRole("link", { name: new RegExp(`^Iconos\\s*${inFamily("fg")}$`) });
		await expect(families(page).getByRole("link", { name: /^Texto/ })).toHaveAttribute(
			"aria-current",
			"location",
		);
		await icons.click();
		await expect(icons).toHaveAttribute("aria-current", "location");
		await expect(families(page).getByRole("link", { name: /^Texto/ })).not.toHaveAttribute(
			"aria-current",
		);
		await expect(visible).toHaveCount(inFamily("fg"));
		await expect(explorer(page).getByRole("status")).toHaveText(`${inFamily("fg")} tokens de Iconos`);
		await expect(page).toHaveURL(/#tokens-fg$/);
		// Con teclado: las pestañas son enlaces
		await families(page)
			.getByRole("link", { name: /^Bordes/ })
			.focus();
		await page.keyboard.press("Enter");
		await expect(visible).toHaveCount(inFamily("border"));

		await page.goto("/foundations/color/#tokens-utility");
		await expect(visible).toHaveCount(inFamily("utility"));
		await expect(filter(page)).toBeInViewport();
	});

	test("sin resultados: un estado vacío nombra lo buscado y «Limpiar búsqueda» lo deshace", async ({
		page,
	}) => {
		await page.goto("/foundations/color/");
		await filter(page).fill("botonn");
		const empty = explorer(page).locator("[data-tokens-empty]");
		await expect(empty.getByRole("heading", { name: "Nada con «botonn»" })).toBeVisible();
		await expect(empty).toContainText("Ningún token de Texto coincide.");
		await expect(explorer(page).locator("tbody tr:visible")).toHaveCount(0);
		await expect(explorer(page).getByRole("status")).toHaveText("Ningún token de Texto con «botonn»");
		await empty.getByRole("button", { name: "Limpiar búsqueda" }).click();
		await expect(empty).toBeHidden();
		await expect(filter(page)).toHaveValue("");
		await expect(filter(page)).toBeFocused();
		await expect(explorer(page).locator("tbody tr:visible")).toHaveCount(inFamily("text"));
	});

	test("calcula el contraste de texto e iconos contra bg-primary y marca el bajo", async ({ page }) => {
		await page.goto("/foundations/color/");
		await expect(row(page, "Texto", "text-primary").locator("[data-ratio=light]")).toHaveText(
			"17,9:1 en claro",
		);
		await expect(row(page, "Texto", "text-warning-primary").locator("[data-ratio=light]")).toHaveText(
			"2,9:1 en claro (bajo)",
		);
		await families(page)
			.getByRole("link", { name: /^Iconos/ })
			.click();
		await expect(row(page, "Iconos", "fg-quaternary").locator("[data-ratio=dark]")).toHaveText(
			"2,5:1 en oscuro (bajo)",
		);
		// Los rellenos no llevan contraste
		await families(page)
			.getByRole("link", { name: /^Fondos/ })
			.click();
		await expect(row(page, "Fondos", "bg-primary")).toBeVisible();
		await expect(row(page, "Fondos", "bg-primary").locator("[data-ratio]")).toHaveCount(0);
	});

	test("la tabla de excepciones sale de la guía con el contraste calculado", async ({ page }) => {
		await page.goto("/foundations/color/");
		const exceptions = page.getByRole("table", { name: /por debajo del contraste recomendado/ });
		await expect(exceptions.getByRole("row", { name: /text-warning-primary/ })).toContainText("2,9:1");
		await expect(exceptions.getByRole("row", { name: /border-primary/ })).toContainText(
			"todo input lleva etiqueta visible",
		);
		await expect(exceptions.getByRole("row", { name: /text-placeholder/ })).toContainText("4,2:1");
	});

	test.describe("En móvil", () => {
		test.use({ viewport: { width: 390, height: 844 } });

		test("cada token es una tarjeta con su nombre, sus dos muestras, su botón de copiar y su uso", async ({
			page,
			context,
		}) => {
			await context.grantPermissions(["clipboard-read", "clipboard-write"]);
			await page.goto("/foundations/color/");
			await expect(cards(page)).toHaveCount(inFamily("text"));
			await expect(explorer(page).locator("table:visible")).toHaveCount(0);
			const card = cards(page).filter({
				has: page.locator("> span:first-child").getByText("text-placeholder", { exact: true }),
			});
			await expect(card.locator("[data-theme-swatch=light]")).toContainText(
				colors["text-placeholder"].light,
			);
			await expect(card.locator("[data-theme-swatch=dark]")).toContainText(
				colors["text-placeholder"].dark,
			);
			await expect(card).toContainText(colors["text-placeholder"].usage);
			await copyReady(page);
			await card.getByRole("button", { name: "text-placeholder", exact: true }).click();
			await expect(page.locator("[data-copy-tooltip]")).toHaveText("Copiado");
			expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("text-placeholder");
			// La página no se desplaza en horizontal, tampoco con la familia de nombres más largos
			const overflow = () =>
				page.evaluate(
					() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
				);
			expect(await overflow()).toBe(0);
			await families(page)
				.getByRole("link", { name: /^Componentes/ })
				.click();
			await expect(cards(page)).toHaveCount(
				total -
					["text", "bg", "border", "fg", "utility", "alpha"].reduce((n, f) => n + inFamily(f), 0),
			);
			expect(await overflow()).toBe(0);
		});

		test("el filtro y el estado vacío funcionan con las tarjetas", async ({ page }) => {
			await page.goto("/foundations/color/");
			await filter(page).fill("placeholder");
			await expect(cards(page)).toHaveCount(1);
			await filter(page).fill("zzzz");
			await expect(cards(page)).toHaveCount(0);
			await expect(page.getByRole("heading", { name: "Nada con «zzzz»" })).toBeVisible();
			await page.getByRole("button", { name: "Limpiar búsqueda" }).click();
			await expect(cards(page)).toHaveCount(inFamily("text"));
		});
	});

	test.describe("sin JavaScript", () => {
		test.use({ javaScriptEnabled: false });
		test("se leen todas las familias seguidas y el filtro no aparece", async ({ page }) => {
			await page.goto("/foundations/color/");
			await expect(explorer(page).locator("tbody tr:visible")).toHaveCount(total);
			await expect(filter(page)).toBeHidden();
			await expect(explorer(page).getByRole("status")).toBeHidden();
			// Las pestañas son enlaces a cada familia
			await families(page)
				.getByRole("link", { name: /^Utility/ })
				.click();
			await expect(table(page, "Utility")).toBeInViewport();
		});
	});
});
