// TextEditor con barras del Figma en Chromium real: la barra flotante sale sobre la selección y Escape la cierra, y la
// barra avanzada aplica color, tipo y tamaño de letra a lo seleccionado con el modo de edición del navegador.
import { expect, type Locator, test } from "@playwright/test";

test.use({ viewport: { width: 1100, height: 1400 } });

const ready = async (page: import("@playwright/test").Page) => {
	await page.goto("/visual/text-editor/");
	await page.waitForFunction(() => {
		const el = document.querySelector("[role=textbox]");
		return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
	});
};

/** Selecciona una palabra del área con doble clic sobre ella. */
const selectWord = async (area: Locator, word: string) => {
	const box = await area.evaluate((el, w) => {
		const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
		for (let n = walker.nextNode(); n; n = walker.nextNode()) {
			const i = (n.textContent ?? "").indexOf(w);
			if (i < 0) continue;
			const r = document.createRange();
			r.setStart(n, i);
			r.setEnd(n, i + w.length);
			const b = r.getBoundingClientRect();
			return { x: b.x + b.width / 2, y: b.y + b.height / 2, top: b.top };
		}
		return null;
	}, word);
	if (!box) throw new Error(`no hay «${word}» en el área`);
	await area.page().mouse.dblclick(box.x, box.y);
	return box;
};

test("flotante: sale sobre la palabra seleccionada, aplica negrita y Escape la cierra", async ({ page }) => {
	await ready(page);
	const area = page.getByRole("textbox", { name: "Flotante" });
	await expect(page.getByRole("toolbar")).toHaveCount(3);
	const word = await selectWord(area, "Revisar");
	const bar = page.locator("[role=toolbar].absolute");
	await expect(bar).toBeVisible();
	// Encima del texto seleccionado
	const barBox = await bar.boundingBox();
	expect(barBox && barBox.y + barBox.height).toBeLessThanOrEqual(word.top);
	// Aunque la palabra esté en el borde izquierdo, la barra no se sale de la pantalla
	expect(barBox?.x).toBeGreaterThanOrEqual(0);
	await bar.getByRole("button", { name: "Negrita" }).click();
	await expect(area.locator("b").first()).toContainText("Revisar");
	// Pulsar un botón no pierde la selección: la barra sigue
	await expect(bar).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(bar).toHaveCount(0);
	await expect(area).toBeFocused();
});

test("flotante: al deseleccionar se esconde y al volver a seleccionar, sale", async ({ page }) => {
	await ready(page);
	const area = page.getByRole("textbox", { name: "Flotante" });
	await selectWord(area, "coche");
	const bar = page.locator("[role=toolbar].absolute");
	await expect(bar).toBeVisible();
	await area.click({ position: { x: 4, y: 4 } });
	await expect(bar).toHaveCount(0);
	await selectWord(area, "ofertas");
	await expect(bar).toBeVisible();
});

test("avanzada: color del texto y tamaño de letra sobre la selección", async ({ page }) => {
	await ready(page);
	const area = page.getByRole("textbox", { name: "Avanzada" });
	const bar = page.getByRole("toolbar").filter({ has: page.getByRole("button", { name: "Generar" }) });
	await selectWord(area, "banco");
	await bar.getByRole("button", { name: "Color del texto" }).click();
	await page
		.getByRole("dialog", { name: "Color del texto" })
		.getByRole("button", { name: "#dc2626" })
		.click();
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await expect(area.locator("[style*='color']")).toContainText("banco");
	await selectWord(area, "ofertas");
	await bar.getByRole("button", { name: "Tamaño de letra" }).click();
	await page.getByRole("option", { name: "24px" }).click();
	await expect(area.locator("font[size='5']").first()).toContainText("ofertas");
});

test("simple: el tooltip de un botón sale al pasar el ratón y con el teclado", async ({ page }) => {
	await ready(page);
	const bar = page
		.getByRole("toolbar")
		.filter({ has: page.getByRole("button", { name: "Color del texto" }) })
		.first();
	const button = bar.getByRole("button", { name: "Subrayado" });
	await button.scrollIntoViewIfNeeded();
	const b = (await button.boundingBox()) as { x: number; y: number; width: number; height: number };
	// React Aria abre el tooltip con un movimiento real del ratón hasta el botón
	await page.mouse.move(b.x - 60, b.y - 60);
	await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
	const tip = page.locator("[role=tooltip]:not(.pointer-events-none)");
	await expect(tip).toHaveText("Subrayado");
	await page.mouse.move(0, 0);
	await expect(tip).toHaveCount(0);
	await button.focus();
	await expect(tip).toBeVisible();
});
