// HelpIcon con el ratón y el teclado reales (el del playground de su página, que no está forzado a `open`): el tooltip
// sale en el lado pedido, apuntando al icono, y se va al quitar el ratón o con Escape.
import { expect, type Locator, type Page, test } from "@playwright/test";

// Hidratado de verdad: Astro quita `ssr` al llamar a hydrateRoot, pero React cuelga sus props después, en otra tarea.
const hydrated = (page: Page) =>
	page.waitForFunction(() => {
		const button = document.querySelector("section[aria-labelledby=ejemplo] button[aria-label^='Ayuda']");
		return !!button && Object.keys(button).some((k) => k.startsWith("__reactProps"));
	});

// Un ratón de verdad: llega al icono desde fuera, en varios pasos (un salto suelto no siempre dispara el hover)
const approach = async (page: Page, el: Locator) => {
	await el.scrollIntoViewIfNeeded();
	// La página se desplaza con suavidad: se espera a que el icono deje de moverse
	let y = -1;
	await expect
		.poll(async () => {
			const before = y;
			y = (await el.boundingBox())?.y ?? -1;
			return y === before;
		})
		.toBe(true);
	const b = (await el.boundingBox()) as { x: number; y: number; width: number; height: number };
	await page.mouse.move(b.x - 60, b.y - 60);
	await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
};

test("al pasar el ratón o llegar con el teclado sale el tooltip, y se cierra", async ({ page }) => {
	await page.goto("/components/help-icon/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await hydrated(page);
	const icon = pg.getByRole("button", { name: "Ayuda: Qué incluye" });
	// Sin los de las vistas previas forzadas (`open`), que ya están en la página
	const tip = page.locator("[role=tooltip]:not(.pointer-events-none)");
	// El lienzo monta el componente en diferido: si el ratón llega antes de que esté listo, se vuelve a acercar
	await expect(async () => {
		await page.mouse.move(0, 0);
		await approach(page, icon);
		await expect(tip).toBeVisible({ timeout: 1500 });
	}).toPass();
	const [i, t] = await Promise.all([icon.boundingBox(), tip.boundingBox()]);
	// Por defecto, encima y centrado sobre el icono
	expect(t && i && t.y + t.height <= i.y).toBe(true);
	expect(t && i && Math.abs(t.x + t.width / 2 - (i.x + i.width / 2))).toBeLessThan(2);
	await page.mouse.move(0, 0);
	await expect(tip).toHaveCount(0);
	// Con teclado de verdad, en una página recién cargada (sin el rastro del ratón): Tab desde el lienzo, que va
	// antes que los controles, hasta el icono
	await page.reload();
	await hydrated(page);
	await pg.getByRole("region", { name: "Vista previa" }).focus();
	for (let n = 0; n < 6 && !(await icon.evaluate((el) => el === document.activeElement)); n++)
		await page.keyboard.press("Tab");
	await expect(tip).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(tip).toHaveCount(0);
});

test("placement=right: el tooltip sale a la derecha del icono", async ({ page }) => {
	await page.goto("/components/help-icon/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await hydrated(page);
	await pg.getByRole("button", { name: /placement/ }).click();
	await page.getByRole("listbox").last().getByRole("option", { name: "right", exact: true }).click();
	const icon = pg.getByRole("button", { name: "Ayuda: Qué incluye" });
	await icon.hover();
	// Sin los de las vistas previas forzadas (`open`), que ya están en la página
	const tip = page.locator("[role=tooltip]:not(.pointer-events-none)");
	const [i, t] = await Promise.all([icon.boundingBox(), tip.boundingBox()]);
	expect(t && i && t.x >= i.x + i.width).toBe(true);
});
