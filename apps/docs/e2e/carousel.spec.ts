// Carousel con deslizar real: la emulación táctil de Chromium manda eventos de toque (que el navegador convierte en
// eventos de puntero), y el carrusel pasa de diapositiva con un arrastre de 48px o más.
import { expect, type Page, test } from "@playwright/test";

test.use({ hasTouch: true, viewport: { width: 800, height: 700 } });

const open = async (page: Page) => {
	await page.goto("/visual/carousel/");
	// Hidratado de verdad: sin los props de React colgados de la flecha, deslizar no hace nada
	await page.waitForFunction(() => {
		const button = document.querySelector(
			"[aria-roledescription=carrusel] button[aria-label^=Diapositiva]",
		);
		return !!button && Object.keys(button).some((k) => k.startsWith("__reactProps"));
	});
	return page.getByRole("region", { name: "Novedades", exact: true });
};

const swipe = async (page: Page, from: { x: number; y: number }, dx: number) => {
	const cdp = await page.context().newCDPSession(page);
	const touch = (type: string, x: number) =>
		cdp.send("Input.dispatchTouchEvent", {
			type,
			touchPoints: type === "touchEnd" ? [] : [{ x, y: from.y }],
		});
	await touch("touchStart", from.x);
	for (let i = 1; i <= 6; i++) await touch("touchMove", from.x + (dx * i) / 6);
	await touch("touchEnd", from.x + dx);
};

test("deslizar el dedo a la izquierda pasa a la siguiente y a la derecha vuelve; un arrastre corto no", async ({
	page,
}) => {
	const carousel = await open(page);
	const dots = carousel.getByRole("button", { name: /Ir a la página/ });
	const box = (await carousel.boundingBox()) as { x: number; y: number; width: number; height: number };
	const middle = { x: box.x + box.width / 2, y: box.y + 60 };
	await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");

	await swipe(page, middle, -30); // 30px: no llega al umbral
	await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");

	await swipe(page, middle, -120);
	await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
	await expect(carousel.getByText("Categoriza solo")).toBeVisible();

	await swipe(page, middle, 120);
	await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");
	await expect(carousel.getByText("Importa tus extractos")).toBeVisible();
});

test("las flechas y los puntos funcionan también con toques; la que no se ve no se puede enfocar", async ({
	page,
}) => {
	const carousel = await open(page);
	await carousel.getByRole("button", { name: "Diapositiva siguiente" }).tap();
	await expect(carousel.getByText("Categoriza solo")).toBeVisible();
	// El contenido de las diapositivas ocultas está inerte: no se encuentra por rol
	await expect(carousel.getByRole("group", { name: "1 de 3" })).toHaveCount(0);
	await carousel.getByRole("button", { name: "Ir a la página 3 de 3" }).tap();
	await expect(carousel.getByText("Comparte informes")).toBeVisible();
});
