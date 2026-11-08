// ContextMenu con el botón derecho real de Chromium: se abre en el punto del puntero, también cerca del borde de la
// ventana, y no sale el menú del navegador.
import { expect, type Page, test } from "@playwright/test";

test.use({ viewport: { width: 1000, height: 700 } });

const open = async (page: Page) => {
	await page.goto("/visual/context-menu/");
	await page.waitForFunction(() => {
		const zone = document.querySelector("div[tabindex='-1'].border-dashed");
		return !!zone && Object.keys(zone).some((k) => k.startsWith("__reactProps"));
	});
	// Las vistas previas abiertas (`defaultOpen`) traen su menú en línea: se cierra con un clic fuera
	await page.mouse.click(5, 5);
	const zones = page.locator("div[tabindex='-1'].border-dashed");
	return zones.first();
};

test("el botón derecho abre el menú en el punto del puntero, con el foco en la primera opción", async ({
	page,
}) => {
	const zone = await open(page);
	const box = (await zone.boundingBox()) as { x: number; y: number; width: number; height: number };
	const at = { x: box.x + 120, y: box.y + 90 };
	await page.mouse.click(at.x, at.y, { button: "right" });
	const menu = page.getByRole("menu", { name: "Acciones" });
	await expect(menu).toBeVisible();
	const m = (await menu.boundingBox()) as { x: number; y: number };
	// El menú nace en el punto del puntero (su esquina superior izquierda)
	expect(Math.abs(m.x - at.x)).toBeLessThan(8);
	expect(Math.abs(m.y - at.y)).toBeLessThan(8);
	await expect(page.getByRole("menuitem", { name: /Cortar/ })).toBeFocused();
	await page.keyboard.press("Escape");
	await expect(menu).toHaveCount(0);
});

test("cerca del borde de la ventana el menú se voltea y cabe", async ({ page }) => {
	const zone = await open(page);
	const box = (await zone.boundingBox()) as { x: number; y: number; width: number; height: number };
	const view = page.viewportSize() as { width: number; height: number };
	// Casi en la esquina inferior derecha de la ventana
	await page.evaluate(() => window.scrollTo(0, 0));
	const at = {
		x: Math.min(view.width - 20, box.x + box.width - 10),
		y: Math.min(view.height - 20, box.y + box.height - 10),
	};
	await page.mouse.click(at.x, at.y, { button: "right" });
	const menu = page.getByRole("menu", { name: "Acciones" });
	await expect(menu).toBeVisible();
	const m = (await menu.boundingBox()) as { x: number; y: number; width: number; height: number };
	expect(m.x).toBeGreaterThanOrEqual(0);
	expect(m.y).toBeGreaterThanOrEqual(0);
	expect(m.x + m.width).toBeLessThanOrEqual(view.width);
	expect(m.y + m.height).toBeLessThanOrEqual(view.height);
});

test("el submenú se abre con → y la opción elegida cierra todo", async ({ page }) => {
	const zone = await open(page);
	const box = (await zone.boundingBox()) as { x: number; y: number };
	// El menú que abre el botón derecho es un popover; las vistas previas en línea (`defaultOpen`) no
	const popover = page.locator("[data-trigger=MenuTrigger] [role=menu]");
	await page.mouse.click(box.x + 330, box.y + 200, { button: "right" });
	await expect(popover).toHaveCount(1);
	await popover.getByRole("menuitem", { name: "Ver detalles" }).focus();
	await page.keyboard.press("ArrowRight");
	await expect(page.getByRole("menuitem", { name: "Historial" })).toBeVisible();
	await page.keyboard.press("ArrowLeft");
	await expect(page.getByRole("menuitem", { name: "Historial" })).toHaveCount(0);
	await popover.getByRole("menuitem", { name: "Duplicar" }).click();
	await expect(popover).toHaveCount(0);
});
