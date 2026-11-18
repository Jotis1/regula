// /changelog/ pinta las listas de una entrada como listas (design D11): la 0.4.0 trae dos, de cuatro y de tres elementos.
import { expect, test } from "./fixtures";

test("la entrada de la 0.4.0 pinta sus dos listas como <ul>/<li> y no deja guiones sueltos", async ({
	page,
}) => {
	await page.goto("/changelog/");
	const version = page.locator('[data-version="0.4.0"]');
	const novedades = version.locator("section", { has: page.getByRole("heading", { name: "Novedades" }) });
	const lists = novedades.locator("ul ul");
	await expect(lists).toHaveCount(2);
	await expect(lists.nth(0).locator("li")).toHaveCount(4);
	await expect(lists.nth(1).locator("li")).toHaveCount(3);
	// Ningún párrafo del historial empieza por un guion: las listas ya no salen como texto corrido
	const loose = await version
		.locator("p")
		.evaluateAll((ps) => ps.filter((p) => /(^|\s)- /.test(p.textContent ?? "")).length);
	expect(loose).toBe(0);
});

test("la 0.9.0 pinta su sublista, sin guiones ni asteriscos sueltos", async ({ page }) => {
	await page.goto("/changelog/");
	const version = page.locator('[data-version="0.9.0"]');
	// La lista de `ChatBox` va dentro de su elemento
	const chatbox = version.locator("li", { hasText: /^ChatBox:/ });
	await expect(chatbox.locator(":scope > ul > li")).toHaveCount(3);
	const text = (await version.textContent()) ?? "";
	expect(text).not.toMatch(/(^|\s)- /);
	expect(text).not.toContain("**");
});

test("la negrita del historial se pinta como negrita", async ({ page }) => {
	await page.goto("/changelog/");
	await expect(page.locator("main strong").first()).toBeVisible();
	expect((await page.locator("main").textContent()) ?? "").not.toContain("**");
});

test("las subidas de dependencias no salen como arreglos", async ({ page }) => {
	await page.goto("/changelog/");
	await expect(page.locator("main")).not.toContainText(/@jotis-me\/\w+@\d+\.\d+\.\d+/);
});

test("la tabla de migración de la 0.8.0 se pinta como tabla, sin barras sueltas", async ({ page }) => {
	await page.goto("/changelog/");
	const version = page.locator('[data-version="0.8.0"]');
	const table = version.locator("table").first();
	await expect(table.locator("th")).toHaveText(["Antes (0.7)", "Ahora"]);
	expect(await table.locator("tbody tr").count()).toBeGreaterThan(5);
	expect((await version.textContent()) ?? "").not.toContain("| ---");
	// Si no cabe, se desplaza dentro de su caja y no la página
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
