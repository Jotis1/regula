// Carousel con `type="strip"` a 390 px y con el JavaScript desactivado: la página se pinta solo en el servidor, se ve la
// primera diapositiva entera y parte de la segunda, la fila se desplaza y no hay flechas.
import { expect, test } from "@playwright/test";

test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } });

test("sin JavaScript, la tira enseña la primera entera y asoma la segunda, se desplaza y no tiene flechas", async ({
	page,
}) => {
	await page.goto("/visual/carousel-strip/");
	const list = page.getByRole("list", { name: "Novedades" });
	await expect(list.getByRole("listitem")).toHaveCount(6);
	await expect(page.getByRole("button")).toHaveCount(0);

	const first = await list.getByRole("listitem").nth(0).boundingBox();
	const second = await list.getByRole("listitem").nth(1).boundingBox();
	const box = await list.boundingBox();
	if (!first || !second || !box) throw new Error("sin caja");
	// La primera cabe entera; la segunda empieza dentro de la lista pero no cabe: asoma
	expect(first.x).toBeGreaterThanOrEqual(box.x);
	expect(first.x + first.width).toBeLessThanOrEqual(box.x + box.width);
	expect(second.x).toBeLessThan(box.x + box.width - 8);
	expect(second.x + second.width).toBeGreaterThan(box.x + box.width);

	// Se desplaza y se detiene en una diapositiva
	const before = await list.evaluate((el) => el.scrollLeft);
	expect(before).toBe(0);
	await list.evaluate((el) => el.scrollBy({ left: 200, behavior: "instant" }));
	await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
	// Snap: 200 px pasa de la mitad de la diapositiva (156), así que se queda en la segunda, alineada con el borde
	await expect
		.poll(async () => {
			const x = await list
				.getByRole("listitem")
				.nth(1)
				.evaluate((el) => el.getBoundingClientRect().left);
			const left = await list.evaluate((el) => el.getBoundingClientRect().left);
			return Math.round(x - left);
		})
		.toBe(0);
});
