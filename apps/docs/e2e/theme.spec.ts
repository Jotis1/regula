import { expect, test } from "@playwright/test";

// Apunta si <html> ya tenía la clase de tema en el momento en que aparece <body>, antes de la primera pintura
const recordThemeAtBody = () => {
	new MutationObserver((_, obs) => {
		if (document.body) {
			(window as unknown as { darkAtBody: boolean }).darkAtBody =
				document.documentElement.classList.contains("dark-mode");
			obs.disconnect();
		}
	}).observe(document, { childList: true, subtree: true });
};
const darkAtBody = (page: import("@playwright/test").Page) =>
	page.evaluate(() => (window as unknown as { darkAtBody: boolean }).darkAtBody);

test("la primera visita sigue la preferencia del sistema", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.addInitScript(recordThemeAtBody);
	await page.goto("/");
	expect(await darkAtBody(page)).toBe(true);
	await page.emulateMedia({ colorScheme: "light" });
	await page.reload();
	expect(await darkAtBody(page)).toBe(false);
});

test("recuerda el tema elegido y carga directamente en él, sin parpadeo", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.addInitScript(recordThemeAtBody);
	await page.goto("/");
	const toggle = page.getByRole("button", { name: "Cambiar a modo oscuro" });
	await toggle.click();
	await expect(page.locator("html")).toHaveClass(/dark-mode/);
	await expect(page.getByRole("button", { name: "Cambiar a modo claro" })).toBeVisible();

	await page.reload();
	expect(await darkAtBody(page)).toBe(true);
	const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
	expect(bg).toBe("rgb(10, 10, 10)");

	await page.getByRole("button", { name: "Cambiar a modo claro" }).click();
	await page.reload();
	expect(await darkAtBody(page)).toBe(false);
});
