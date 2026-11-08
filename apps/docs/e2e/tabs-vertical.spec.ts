// Tabs verticales a 1440px (la lista) y a 390px (el desplegable): una sola versión a la vista en cada ancho.
import { expect, test } from "@playwright/test";

const open = async (page: import("@playwright/test").Page, width: number) => {
	await page.setViewportSize({ width, height: 900 });
	await page.goto("/visual/tabs/");
	await page.waitForFunction(() => {
		const tab = document.querySelector("[role=tablist][aria-label='Ajustes con raya'] [role=tab]");
		return !!tab && Object.keys(tab).some((k) => k.startsWith("__reactProps"));
	});
};

test("a 1440px se ve la lista vertical, con ↓ entre pestañas, y no el desplegable", async ({ page }) => {
	await open(page, 1440);
	const list = page.getByRole("tablist", { name: "Ajustes con raya" });
	await expect(list).toBeVisible();
	await expect(list).toHaveAttribute("aria-orientation", "vertical");
	const tabs = list.getByRole("tab");
	const [a, b] = [await tabs.nth(0).boundingBox(), await tabs.nth(1).boundingBox()];
	expect(a && b && b.y > a.y && Math.abs(b.x - a.x) < 1).toBe(true);
	await tabs.nth(0).focus();
	await page.keyboard.press("ArrowDown");
	await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
	await expect(page.getByRole("button", { name: /Ajustes con raya/ })).toHaveCount(0);
});

test("a 390px la lista se oculta y el desplegable cambia la elegida, sin desplazamiento horizontal", async ({
	page,
}) => {
	await open(page, 390);
	await expect(page.getByRole("tablist", { name: "Ajustes con raya" })).toHaveCount(0);
	const select = page.getByRole("button", { name: /Ajustes con raya/ });
	await expect(select).toBeVisible();
	await expect(select).toContainText("Mis datos");
	await select.click();
	await page
		.getByRole("listbox")
		.getByRole("option", { name: /Equipo/ })
		.click();
	await expect(select).toContainText("Equipo");
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
