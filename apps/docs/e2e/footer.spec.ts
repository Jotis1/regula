// Footer en un contenedor de 375 px: las columnas de enlaces se apilan de dos en dos, como el Figma en móvil.
import { expect, test } from "@playwright/test";

test("a 375 px las columnas van de dos en dos", async ({ page }) => {
	await page.goto("/visual/footer/");
	const footer = page.locator("[data-footer-mobile] footer");
	const titles = footer.getByRole("heading", { level: 2 });
	await expect(titles).toHaveCount(4);
	const boxes = await titles.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
	// Dos por fila: la primera y la segunda a la misma altura, la tercera debajo
	expect(Math.round(boxes[0]?.top ?? 0)).toBe(Math.round(boxes[1]?.top ?? 1));
	expect(boxes[2]?.top ?? 0).toBeGreaterThan((boxes[0]?.top ?? 0) + 20);
	expect(Math.round(boxes[2]?.left ?? 0)).toBe(Math.round(boxes[0]?.left ?? 1));
});
