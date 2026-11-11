import { expect, test } from "@playwright/test";

test("ColorPickerDropdown se abre con el teclado, Escape lo cierra y el foco vuelve", async ({ page }) => {
	await page.goto("/visual/color-picker-dropdown/");
	const trigger = page.getByRole("button", { name: "Color: #7F56D9" }).first();
	// Espera a que la isla esté hidratada
	await page.waitForFunction(() =>
		[...document.querySelectorAll("button")].some((b) =>
			Object.keys(b).some((k) => k.startsWith("__reactProps")),
		),
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
