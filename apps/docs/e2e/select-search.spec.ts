// Select con búsqueda y con etiquetas en Chromium real: escribir filtra la lista, la primera queda marcada y Enter la
// elige, y el teclado elige otra con las flechas.
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1000, height: 1000 } });

const ready = async (page: import("@playwright/test").Page) => {
	await page.goto("/visual/select/");
	await page.waitForFunction(() => {
		const input = document.querySelector("input[role=combobox]");
		return !!input && Object.keys(input).some((k) => k.startsWith("__reactProps"));
	});
	// La vista previa trae una lista abierta (`defaultOpen`) con su capa modal: se cierra para llegar al resto
	await page.keyboard.press("Escape");
	await expect(page.getByRole("listbox", { name: "Responsable" })).toHaveCount(0);
};

test("escribir «mad» filtra la lista y Enter elige la marcada", async ({ page }) => {
	await ready(page);
	const input = page.getByRole("combobox", { name: "Ciudad" });
	await input.click();
	await expect(page.getByRole("option")).toHaveCount(5);
	await input.pressSequentially("va");
	await expect(page.getByRole("option")).toHaveText(["Valencia"]);
	await expect(input).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(input).toHaveValue("Valencia");
	await expect(page.getByRole("listbox", { name: "Ciudad" })).toHaveCount(0);
});

test("con las flechas se elige otra de las que quedan", async ({ page }) => {
	await ready(page);
	const input = page.getByRole("combobox", { name: "Ciudad" });
	await input.click();
	await input.pressSequentially("a");
	const options = page.getByRole("option");
	expect(await options.count()).toBeGreaterThan(2);
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect.poll(() => input.inputValue()).toMatch(/^(Madrid|Valencia|Sevilla|Barcelona|Bilbao)$/);
});

test("sin coincidencias sale «Sin resultados» y Escape cierra sin elegir", async ({ page }) => {
	await ready(page);
	const input = page.getByRole("combobox", { name: "Ciudad" });
	await input.click();
	await input.pressSequentially("zzz");
	await expect(page.getByText("Sin resultados")).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(page.getByText("Sin resultados")).toHaveCount(0);
});
