import { colors, shadows, type } from "@jotis-me/tokens";
import { expect, test } from "@playwright/test";

test("la página de color tiene una fila por token del paquete", async ({ page }) => {
	await page.goto("/foundations/color/");
	await expect(page.locator("table button[data-copy]")).toHaveCount(Object.keys(colors).length);
	await expect(page.getByRole("button", { name: "Copiar bg-brand-solid", exact: true })).toBeVisible();
});

test("pulsar un token copia su utilidad y lo confirma", async ({ page, context }) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/foundations/color/");
	// La burbuja es una isla `client:idle`: hasta que se hidrata, un clic no copia
	await expect(
		page.locator("astro-island").filter({ has: page.locator("[data-copy-tooltip]") }),
	).not.toHaveAttribute("ssr", /.*/);
	await page.getByRole("button", { name: "Copiar bg-brand-solid", exact: true }).click();
	// Dice solo «Copiado», sin repetir el valor (uno largo desbordaría el aviso)
	await expect(page.locator("[data-copy-tooltip]")).toHaveText("Copiado");
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("bg-brand-solid");
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
}

test("cada muestra de tipografía se pinta con el tamaño, interlineado y peso de su token", async ({
	page,
}) => {
	await page.goto("/foundations/typography/");
	const shown = await page.locator("table button[data-copy]").evaluateAll((buttons) =>
		buttons.map((b) => {
			const cs = getComputedStyle(b.nextElementSibling as Element);
			return `${b.textContent} ${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight}`;
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
		.locator(".shadow-sample")
		.evaluateAll((spans) =>
			spans
				.filter((s) => getComputedStyle(s).boxShadow === "none")
				.map((s) => s.closest("tr")?.querySelector("button")?.textContent),
		);
	expect(none).toEqual([]);
	await expect(page.locator(".shadow-sample")).toHaveCount(Object.keys(shadows).length);
});

test("las notas de uso salen en castellano", async ({ page }) => {
	await page.goto("/foundations/color/");
	await expect(
		page.getByText("Texto y titulares sobre bg-primary, bg-secondary y bg-tertiary."),
	).toBeVisible();
	await expect(page.getByText("Body copy and headings")).toHaveCount(0);
});

test("las URLs van en inglés", async ({ page }) => {
	// La portada va sin navegación lateral: se mira en una página que la tiene
	await page.goto("/foundations/principles/");
	const hrefs = await page
		.locator("aside nav a")
		.evaluateAll((as) => as.map((a) => a.getAttribute("href")));
	expect(hrefs.length).toBeGreaterThan(80);
	for (const href of hrefs) expect(href).toMatch(/^\/((start|foundations|icons|components)\/.*)?$/);
});

test.describe("tabla de tokens de Color", () => {
	const table = (page: import("@playwright/test").Page) =>
		page.getByRole("table", { name: /Tokens de color, con sus valores/ });
	const row = (page: import("@playwright/test").Page, name: string) =>
		table(page)
			.getByRole("row")
			.filter({ has: page.getByRole("rowheader", { name: new RegExp(`^${name}\\b`) }) });

	test("calcula el contraste de texto e iconos contra bg-primary y marca el bajo", async ({ page }) => {
		await page.goto("/foundations/color/");
		await expect(row(page, "text-primary").locator("[data-ratio]").first()).toHaveText("17,9:1");
		await expect(row(page, "text-warning-primary").locator("[data-ratio]").first()).toHaveText(
			"2,9:1 · bajo",
		);
		await expect(row(page, "fg-quaternary").locator("[data-ratio]").nth(1)).toHaveText("2,5:1 · bajo");
		// Los rellenos no llevan contraste
		await expect(row(page, "bg-primary").locator("[data-ratio]")).toHaveCount(0);
	});

	test("filtra por texto y por familia, con recuentos", async ({ page }) => {
		await page.goto("/foundations/color/");
		const visible = () => table(page).locator("tbody tr:visible");
		await expect(visible()).toHaveCount(Object.keys(colors).length);
		const families = page.getByRole("group", { name: "Familia de tokens" });
		const icons = Object.keys(colors).filter((n) => n.startsWith("fg-")).length;
		await expect(families.getByRole("button", { name: new RegExp(`^Icono ${icons}$`) })).toBeVisible();
		await families.getByRole("button", { name: /^Icono/ }).click();
		await expect(families.getByRole("button", { name: /^Icono/ })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		await expect(visible()).toHaveCount(icons);
		await families.getByRole("button", { name: /^Todas/ }).click();
		await page.getByLabel("Filtrar tokens").fill("error");
		const names = await visible().locator("th").allTextContents();
		expect(names.length).toBeGreaterThan(0);
		for (const n of names) expect(n.toLowerCase()).toContain("error");
		await page.getByLabel("Filtrar tokens").fill("zzzz");
		await expect(page.getByText("Ningún token se llama así.")).toBeVisible();
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

	test.describe("sin JavaScript", () => {
		test.use({ javaScriptEnabled: false });
		test("se lee entera y el filtro no aparece", async ({ page }) => {
			await page.goto("/foundations/color/");
			await expect(table(page).locator("tbody tr:visible")).toHaveCount(Object.keys(colors).length);
			await expect(page.getByLabel("Filtrar tokens")).toBeHidden();
		});
	});
});

test("la tabla de tokens no se maqueta hasta acercarse, sin que el alto de la página salte", async ({
	page,
}) => {
	await page.goto("/foundations/color/");
	const table = page.locator("[data-tokens-table]");
	await expect(table).toHaveCSS("content-visibility", "auto");
	const before = await page.evaluate(() => document.documentElement.scrollHeight);
	await table.scrollIntoViewIfNeeded();
	await page.mouse.wheel(0, 2000);
	const after = await page.evaluate(() => document.documentElement.scrollHeight);
	// El alto estimado (130 px por fila) se queda a menos de un 5 % del real
	expect(Math.abs(after - before) / after).toBeLessThan(0.05);
	// Con el teclado se llega a una fila aún sin pintar
	const copy = table.locator("[data-copy]").nth(120);
	await copy.focus();
	await expect(copy).toBeInViewport();
});
