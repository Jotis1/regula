import { iconNames } from "@jotis-me/icons";
import { expect, test } from "@playwright/test";

test("la galería muestra todos los iconos", async ({ page }) => {
	await page.goto("/icons/");
	await expect(page.locator("[data-icon]")).toHaveCount(iconNames.length);
	await expect(page.locator("#icon-count")).toHaveText(`${iconNames.length} iconos`);
});

test("buscar «cal» deja solo los iconos cuyo nombre lo contiene", async ({ page }) => {
	await page.goto("/icons/");
	await page.getByLabel("Buscar icono").fill("cal");
	const expected = iconNames.filter((n) => n.includes("cal")).sort();
	const visible = await page
		.locator("[data-icon]:not([hidden])")
		.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.icon as string).sort());
	expect(visible).toEqual(expected);
	expect(visible).toContain("calendar");
	await expect(page.locator("#icon-count")).toHaveText(`${expected.length} iconos`);
});

test("sin resultados lo dice", async ({ page }) => {
	await page.goto("/icons/");
	await page.getByLabel("Buscar icono").fill("zzzz");
	await expect(page.getByText("Ningún icono se llama así.")).toBeVisible();
});

test("elegir un icono muestra su uso y se puede copiar", async ({ page, context }) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/icons/");
	await page.locator('[data-select="calendar"]').click();
	await expect(page.locator('[data-select="calendar"]')).toHaveAttribute("aria-pressed", "true");
	await expect(page.locator("#icon-detail-name")).toHaveText("calendar");
	await page.locator('[data-field="react"]').click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('<Icon name="calendar" />');
	await page.locator('[data-field="astro"]').click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		'import IconCalendar from "@jotis-me/icons/svg/calendar.svg?raw";',
	);
	await page.locator('[data-field="svg"]').click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('stroke="currentColor"');
});
