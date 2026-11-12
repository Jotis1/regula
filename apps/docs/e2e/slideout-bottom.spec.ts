// Slideout con `side="bottom"` a 390 px: la hoja ocupa el ancho de la pantalla pegada abajo con el foco dentro, Escape
// la cierra y el foco vuelve al botón que la abrió.
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 780 } });

test("la hoja inferior ocupa el ancho, pegada abajo y con el foco dentro; Escape la cierra y el foco vuelve", async ({
	page,
}) => {
	await page.goto("/visual/slideout-bottom/");
	const opener = page.getByRole("button", { name: "Ver detalle" });
	// Hidratado de verdad: sin los props de React colgados del botón, pulsarlo no abre nada
	await page.waitForFunction(() => {
		const button = [...document.querySelectorAll("button")].find((b) => b.textContent === "Ver detalle");
		return !!button && Object.keys(button).some((k) => k.startsWith("__reactProps"));
	});
	await opener.click();

	const sheet = page.getByRole("dialog", { name: "Alquiler" });
	await expect(sheet).toBeVisible();
	// La entrada es una transición de 250 ms: se mide cuando ha terminado
	await expect
		.poll(async () => {
			const box = await sheet.boundingBox();
			return box ? Math.round(box.y + box.height) : null;
		})
		.toBe(780);
	const box = await sheet.boundingBox();
	expect(Math.round(box?.x ?? -1)).toBe(0);
	expect(Math.round(box?.width ?? 0)).toBe(390);
	expect(box?.height ?? 0).toBeLessThanOrEqual(780 * 0.85 + 1);
	await expect(sheet.locator("[aria-hidden=true]").first()).toBeAttached();
	expect(await sheet.evaluate((el) => el.contains(document.activeElement))).toBe(true);

	await page.keyboard.press("Escape");
	await expect(sheet).toBeHidden();
	await expect(opener).toBeFocused();
});
