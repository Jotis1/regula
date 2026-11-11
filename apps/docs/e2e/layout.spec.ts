// Ancho de la web: la navegación lateral queda fuera del contenedor de la guía (container-max-width-desktop, 1280) y
// la cabecera, el contenido y el pie miden como mucho 1280, centrados.
import { expect, test } from "@playwright/test";

const CONTAINER = 1280;

test.describe("ancho del contenedor", () => {
	test("a 1920 px, la barra lateral va al borde y el resto mide como mucho 1280", async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1000 });
		await page.goto("/components/button/");
		const aside = await page.locator("aside").first().boundingBox();
		expect(aside?.x).toBe(0);
		const boxes = await page.locator("[data-container]").evaluateAll((els) =>
			els.map((el) => {
				const r = el.getBoundingClientRect();
				return { width: r.width, left: r.left, right: r.right };
			}),
		);
		// cabecera, contenido y pie
		expect(boxes).toHaveLength(3);
		for (const b of boxes) expect(b.width).toBeLessThanOrEqual(CONTAINER);
		// El contenido, centrado en lo que deja la barra lateral; cabecera y pie, en la ventana
		const [header, content, footer] = boxes as [(typeof boxes)[0], (typeof boxes)[0], (typeof boxes)[0]];
		expect(header.width).toBe(CONTAINER);
		expect(footer.width).toBe(CONTAINER);
		expect(header.left).toBeCloseTo((1920 - CONTAINER) / 2, 0);
		expect(content.left).toBeGreaterThanOrEqual(288); // a la derecha de la barra lateral (w-72)
	});

	test("a 1280 px no hay desplazamiento horizontal", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 900 });
		for (const url of ["/components/button/", "/components/", "/foundations/color/"]) {
			await page.goto(url);
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			);
			expect(overflow, url).toBeLessThanOrEqual(0);
		}
	});
});
