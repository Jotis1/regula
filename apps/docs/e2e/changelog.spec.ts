// /changelog/ pinta las listas de una entrada como listas (design D11): la 0.4.0 trae dos, de cuatro y de tres elementos.
import { expect, test } from "@playwright/test";

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
