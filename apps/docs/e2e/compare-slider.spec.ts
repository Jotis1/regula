// CompareSlider en /visual/compare-slider-test/: con ratón y con teclado la línea se mueve y el recorte la sigue, y sin
// JavaScript se ve en su valor inicial y el mando queda desactivado.
import { expect, type Page, test } from "@playwright/test";

const slider = (page: Page) => page.getByRole("slider", { name: "Tema de la pantalla" });
const at = (page: Page) =>
	page.evaluate(() => {
		const input = document.querySelector<HTMLInputElement>('input[type="range"]');
		return input?.parentElement?.style.getPropertyValue("--compare-at") ?? "";
	});

test.describe("con JavaScript", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/visual/compare-slider-test/");
		// Hidratado de verdad: el mando se activa cuando el cliente toma la página
		await expect(slider(page)).toBeEnabled();
	});

	test("empieza en 30 y anuncia su valor con la capa de arriba", async ({ page }) => {
		await expect(slider(page)).toHaveValue("30");
		await expect(slider(page)).toHaveAttribute("aria-valuetext", "30 % Después");
		expect(await at(page)).toBe("30%");
	});

	test("pulsar y arrastrar con el ratón lleva la línea al punto y el recorte la sigue", async ({
		page,
	}) => {
		const box = await slider(page).boundingBox();
		if (!box) throw new Error("sin caja");
		const y = box.y + box.height / 2;

		await page.mouse.click(box.x + box.width * 0.8, y);
		await expect.poll(async () => Number(await slider(page).inputValue())).toBeGreaterThanOrEqual(79);
		await expect.poll(async () => Number(await slider(page).inputValue())).toBeLessThanOrEqual(81);

		await page.mouse.move(box.x + box.width * 0.8, y);
		await page.mouse.down();
		await page.mouse.move(box.x + box.width * 0.25, y, { steps: 8 });
		await page.mouse.up();
		await expect.poll(async () => Number(await slider(page).inputValue())).toBeGreaterThanOrEqual(24);
		await expect.poll(async () => Number(await slider(page).inputValue())).toBeLessThanOrEqual(26);

		// El recorte sigue al valor: la línea y la capa de arriba parten del mismo punto
		const value = await slider(page).inputValue();
		expect(await at(page)).toBe(`${value}%`);
		await expect(page.getByTestId("valor")).toHaveText(value);
		const clip = await page
			.getByText("Capa de arriba")
			.evaluate((el) => getComputedStyle(el.parentElement as HTMLElement).clipPath);
		expect(clip).toContain(`${value}%`);
	});

	test("con el teclado: flechas, Re Pág, Av Pág, Inicio y Fin", async ({ page }) => {
		await page.keyboard.press("Tab");
		await expect(slider(page)).toBeFocused();

		await page.keyboard.press("ArrowRight");
		await page.keyboard.press("ArrowRight");
		await page.keyboard.press("ArrowRight");
		await expect(slider(page)).toHaveValue("33");
		await page.keyboard.press("ArrowLeft");
		await expect(slider(page)).toHaveValue("32");
		await page.keyboard.press("PageUp");
		await expect(slider(page)).toHaveValue("42");
		await page.keyboard.press("PageDown");
		await page.keyboard.press("PageDown");
		await expect(slider(page)).toHaveValue("22");
		await page.keyboard.press("End");
		await expect(slider(page)).toHaveValue("100");
		await expect(slider(page)).toHaveAttribute("aria-valuetext", "100 % Después");
		await page.keyboard.press("Home");
		await expect(slider(page)).toHaveValue("0");
		await expect(page.getByTestId("valor")).toHaveText("0");
		expect(await at(page)).toBe("0%");
	});

	test("la capa de abajo no está en el árbol de accesibilidad", async ({ page }) => {
		await expect(page.getByRole("slider")).toHaveCount(1);
		const hidden = await page
			.getByText("Capa de abajo", { exact: true })
			.evaluate((el) => (el.parentElement as HTMLElement).matches("[aria-hidden=true][inert]"));
		expect(hidden).toBe(true);
	});
});

test.describe("sin JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("la línea está en su valor inicial, se ven las dos capas y el mando no se mueve", async ({
		page,
	}) => {
		await page.goto("/visual/compare-slider-test/");
		expect(await at(page)).toBe("30%");
		await expect(page.getByText("Capa de abajo")).toBeAttached();
		await expect(page.getByText("Capa de arriba")).toBeVisible();
		await expect(slider(page)).toBeDisabled();
		await expect(slider(page)).toHaveValue("30");
	});
});
