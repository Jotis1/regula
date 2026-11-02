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
	await page.getByRole("button", { name: "Copiar bg-brand-solid", exact: true }).click();
	await expect(page.getByRole("status")).toHaveText("Copiado: bg-brand-solid");
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
	await page.goto("/");
	const hrefs = await page
		.locator("aside nav a")
		.evaluateAll((as) => as.map((a) => a.getAttribute("href")));
	for (const href of hrefs) expect(href).toMatch(/^\/(start|foundations|icons|components)\//);
});
