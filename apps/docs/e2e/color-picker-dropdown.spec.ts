import { expect, test } from "./hydration";

test("ColorPickerDropdown se abre con el teclado, Escape lo cierra y el foco vuelve", async ({ page }) => {
	await page.goto("/visual/color-picker-dropdown/");
	const trigger = page.getByRole("button", { name: /^Color\s*:\s*#7F56D9$/ }).first();
	// Espera a que la isla esté hidratada
	await page.waitForFunction(() =>
		[...document.querySelectorAll("button")].some((b) => window.islandReady(b)),
	);
	await trigger.focus();
	await page.keyboard.press("Enter");
	const dialog = page.getByRole("dialog", { name: "Color" });
	await expect(dialog).toBeVisible();
	await expect(dialog.getByRole("tablist")).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveCount(0);
	await expect(trigger).toBeFocused();
});
