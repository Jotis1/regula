// Ancho de la web: la navegación lateral queda fuera del contenedor de la guía (container-max-width-desktop, 1280) y
// el contenido y el pie miden como mucho 1280, centrados; la cabecera ocupa toda la ventana.
import { expect, test } from "@playwright/test";

const CONTAINER = 1280;

test.describe("ancho del contenedor", () => {
	test("a 1920 px, la barra lateral va al borde y el resto mide como mucho 1280", async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1000 });
		await page.goto("/components/button/");
		const aside = await page.locator("aside").first().boundingBox();
		expect(aside?.x).toBe(0);
		const rect = (el: Element) => {
			const r = el.getBoundingClientRect();
			return { width: r.width, left: r.left, right: r.right };
		};
		// La cabecera es el HeaderNav `fullWidth` del paquete: ocupa toda la ventana, con la marca alineada con el lateral
		const header = await page.locator("body > header").evaluate(rect);
		expect(header.width).toBe(1920);
		// El pie es el Footer del paquete: su contenido va también en un contenedor de 1280
		const footerBox = await page.locator("body > footer div.mx-auto").first().evaluate(rect);
		const contentBox = await page.locator("[data-container]").first().evaluate(rect);
		const boxes = [contentBox, footerBox];
		for (const b of boxes) expect(b.width).toBeLessThanOrEqual(CONTAINER);
		// El contenido, centrado en lo que deja la barra lateral; el pie, en la ventana
		const [content, footer] = boxes as [(typeof boxes)[0], (typeof boxes)[0]];
		expect(footer.width).toBe(CONTAINER);
		expect(content.left).toBeGreaterThanOrEqual(296); // a la derecha de la barra lateral (296 px)
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
