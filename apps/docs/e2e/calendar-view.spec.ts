// CalendarView en Chromium real: el selector cambia de vista con el teclado y la semana en un calendario estrecho
// enseña solo la columna del día elegido.
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 800, height: 900 } });

const ready = async (page: import("@playwright/test").Page) => {
	await page.goto("/visual/calendar-view/");
	await page.waitForFunction(() => {
		const b = document.querySelector("button[aria-haspopup]");
		return !!b && Object.keys(b).some((k) => k.startsWith("__reactProps"));
	});
};

test("el selector de vista pasa de semana a día con el teclado", async ({ page }) => {
	await ready(page);
	const week = page.locator("div.rounded-xl").nth(1);
	await expect(week.getByRole("list")).toHaveCount(7);
	await week.getByRole("button", { name: /Vista semanal/ }).focus();
	await page.keyboard.press("Enter");
	await page.getByRole("menuitemradio", { name: "Vista diaria" }).click();
	await expect(week.getByRole("list")).toHaveCount(1);
	await expect(week.getByRole("heading", { level: 3 })).toHaveText("8 de enero de 2027");
});

test("en un calendario de 375 px la semana enseña solo la columna del día elegido", async ({ page }) => {
	await ready(page);
	const frame = page.locator("div[style*='375px'] > div").first();
	const columns = frame.getByRole("list");
	await expect(columns.filter({ visible: true })).toHaveCount(1);
	await frame.getByRole("button", { name: /martes, 5 de enero/ }).click();
	await expect(frame.getByRole("list", { name: /5 de enero/ })).toBeVisible();
	await expect(frame.getByRole("list", { name: /8 de enero/ })).toBeHidden();
});
