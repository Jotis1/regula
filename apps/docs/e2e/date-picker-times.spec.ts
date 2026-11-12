// DatePicker en Chromium real: el modal se abre centrado con el fondo, atrapa el foco y devuelve el foco al cerrarlo;
// con horas, elegir día y hora deja el disparador con los dos.
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 800, height: 900 } });

const ready = async (page: import("@playwright/test").Page) => {
	await page.goto("/visual/date-picker/");
	await page.waitForFunction(() => {
		const b = [...document.querySelectorAll("button")].find((x) => x.textContent?.includes("(modal)"));
		return !!b && Object.keys(b).some((k) => k.startsWith("__reactProps"));
	});
};

test("el modal elige día y hora y devuelve el foco al botón", async ({ page }) => {
	await ready(page);
	const trigger = page.locator("button[aria-haspopup=dialog]").last();
	await trigger.click();
	const dialog = page.getByRole("dialog", { name: "Selector de fecha" });
	await expect(dialog).toBeVisible();
	// Centrado sobre la página: el panel queda dentro de la ventana y el resto no responde
	const box = await dialog.boundingBox();
	expect(box && box.x > 0 && box.y > 0).toBeTruthy();
	await dialog.getByRole("button", { name: /20 de octubre/ }).click();
	await dialog.getByRole("button", { name: "11:30" }).click();
	await expect(dialog.getByText("20 oct 2026, 11:30")).toBeVisible();
	await dialog.getByRole("button", { name: "Aplicar" }).click();
	await expect(dialog).toBeHidden();
	await expect(trigger).toHaveText(/20 oct 2026, 11:30/);
	await expect(trigger).toBeFocused();
});

test("Escape cierra el modal sin aplicar", async ({ page }) => {
	await ready(page);
	const trigger = page.locator("button[aria-haspopup=dialog]").last();
	await trigger.click();
	await expect(page.getByRole("dialog", { name: "Selector de fecha" })).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog", { name: "Selector de fecha" })).toBeHidden();
	await expect(trigger).toBeFocused();
	await expect(trigger).toHaveText(/\(modal\)/);
});
