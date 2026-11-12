// Slider con `range` en Chromium real: cada mando se maneja con el teclado por separado, el mínimo no pasa del máximo
// y arrastrar con el ratón mueve el mando más cercano.
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 900, height: 900 } });

const ready = async (page: import("@playwright/test").Page) => {
	await page.goto("/visual/slider/");
	await page.waitForFunction(() => {
		const input = document.querySelector("input[type=range]");
		const root = input?.closest("[data-rac]");
		return !!root && Object.keys(root).some((k) => k.startsWith("__reactProps"));
	});
};

test("el mando izquierdo del rango cambia solo el mínimo y no pasa del máximo", async ({ page }) => {
	await ready(page);
	const min = page.getByRole("slider", { name: /Mínimo/ }).first();
	const max = page.getByRole("slider", { name: /Máximo/ }).first();
	await expect(min).toHaveValue("25");
	await expect(max).toHaveValue("50");
	await min.focus();
	await page.keyboard.press("ArrowRight");
	await expect(min).toHaveValue("26");
	await expect(max).toHaveValue("50");
	await page.keyboard.press("End");
	await expect(min).toHaveValue("50");
	await expect(max).toHaveValue("50");
});

test("el mando derecho se maneja aparte y Tab pasa de un mando al otro", async ({ page }) => {
	await ready(page);
	const min = page.getByRole("slider", { name: /Mínimo/ }).first();
	const max = page.getByRole("slider", { name: /Máximo/ }).first();
	await min.focus();
	await page.keyboard.press("Tab");
	await expect(max).toBeFocused();
	await page.keyboard.press("ArrowLeft");
	await expect(max).toHaveValue("49");
	await expect(min).toHaveValue("25");
});

test("arrastrar la pista con el ratón mueve el mando", async ({ page }) => {
	await ready(page);
	const min = page.getByRole("slider", { name: /Mínimo/ }).first();
	const thumb = min.locator("xpath=ancestor::div[contains(@class,'size-6')][1]");
	const box = (await thumb.boundingBox()) as { x: number; y: number; width: number; height: number };
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width / 2 - 60, box.y + box.height / 2, { steps: 5 });
	await page.mouse.up();
	expect(Number(await min.inputValue())).toBeLessThan(25);
});
