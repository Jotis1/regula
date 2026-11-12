// MarketingNav en Chromium: el menú se abre con el teclado, el foco entra y Escape lo devuelve, en escritorio (a todo
// el ancho) y en móvil.
import { expect, type Page, test } from "@playwright/test";

const hydrated = (page: Page) =>
	page.waitForFunction(() =>
		[...document.querySelectorAll("button")].some((b) =>
			Object.keys(b).some((k) => k.startsWith("__reactProps")),
		),
	);

test.describe("escritorio", () => {
	test.use({ viewport: { width: 1440, height: 900 } });
	test("a todo el ancho: Enter abre, el foco entra y Escape lo devuelve", async ({ page }) => {
		await page.goto("/visual/marketing-nav/");
		await hydrated(page);
		// La cabecera móvil de la última demo está oculta: el primer botón visible «Producto» es de escritorio
		const trigger = page.getByRole("button", { name: "Producto" }).filter({ visible: true }).nth(3);
		await trigger.focus();
		await page.keyboard.press("Enter");
		const dialog = page.getByRole("dialog", { name: "Producto" });
		await expect(dialog).toBeVisible();
		await expect.poll(() => dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
		await page.keyboard.press("Escape");
		await expect(dialog).toHaveCount(0);
		await expect(trigger).toBeFocused();
	});
});

test.describe("móvil", () => {
	test.use({ viewport: { width: 390, height: 844 } });
	test("el botón de menú abre el menú, se despliega un apartado y Escape devuelve el foco", async ({
		page,
	}) => {
		await page.goto("/visual/marketing-nav/");
		await hydrated(page);
		const open = page.getByRole("button", { name: "Abrir menú" }).filter({ visible: true }).first();
		await open.focus();
		await page.keyboard.press("Enter");
		const dialog = page.getByRole("dialog", { name: "Principal" });
		await expect(dialog).toBeVisible();
		const section = dialog.getByRole("button", { name: "Recursos" });
		await section.click();
		await expect(section).toHaveAttribute("aria-expanded", "true");
		await expect(dialog.getByRole("link", { name: /Blog/ })).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(dialog).toHaveCount(0);
		await expect(open).toBeFocused();
	});
});
