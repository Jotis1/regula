// ButtonUtility con el ratón y el teclado reales (el del playground de su página, sin tooltip forzado): el tooltip
// dice qué hace el botón y se va al quitar el ratón o con Escape.
import { expect, type Locator, type Page, test } from "@playwright/test";

// Hidratado de verdad: Astro quita `ssr` al llamar a hydrateRoot, pero React cuelga sus props después, en otra tarea.
const hydrated = (page: Page) =>
	page.waitForFunction(() => {
		const button = document.querySelector("section[aria-labelledby=ejemplo] button[aria-label=Copiar]");
		return !!button && Object.keys(button).some((k) => k.startsWith("__reactProps"));
	});

// Un ratón de verdad: llega al botón desde fuera, en varios pasos (un salto suelto no siempre dispara el hover)
const approach = async (page: Page, el: Locator) => {
	await el.scrollIntoViewIfNeeded();
	const b = (await el.boundingBox()) as { x: number; y: number; width: number; height: number };
	await page.mouse.move(b.x - 60, b.y - 60);
	await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
};

test("al pasar el ratón o llegar con el teclado sale el tooltip con su nombre, y se cierra", async ({
	page,
}) => {
	await page.goto("/components/button-utility/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await hydrated(page);
	const button = pg.getByRole("button", { name: "Copiar", exact: true });
	await approach(page, button);
	// Sin los de las vistas previas forzadas, que ya están en la página
	const tip = page.locator("[role=tooltip]:not(.pointer-events-none)");
	await expect(tip).toHaveText("Copiar");
	const [b, t] = await Promise.all([button.boundingBox(), tip.boundingBox()]);
	expect(t && b && t.y + t.height <= b.y).toBe(true);
	await page.mouse.move(0, 0);
	await expect(tip).toHaveCount(0);
	await button.focus();
	await expect(tip).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(tip).toHaveCount(0);
});

test("deshabilitado no abre tooltip", async ({ page }) => {
	await page.goto("/components/button-utility/");
	await hydrated(page);
	const disabled = page.locator("button[aria-label=Borrar][disabled]").first();
	await approach(page, disabled);
	await page.waitForTimeout(500);
	await expect(page.locator("[role=tooltip]:not(.pointer-events-none)")).toHaveCount(0);
});
