// VerificationCodeInput en Chromium, Firefox y WebKit: el paso entre casillas, el pegado y el autocompletado
// dependen de cómo cada navegador entrega los eventos de teclado, `paste` e `input`.
import { expect, type Page, test } from "@playwright/test";

const open = async (page: Page) => {
	await page.goto("/visual/verification-code-input/");
	// Hidratado de verdad: Astro quita `ssr` de la isla al llamar a hydrateRoot, pero React hidrata después, en otra
	// tarea. Hasta que React no cuelga sus props del <input>, escribir en él no pasa por onChange.
	await page.waitForFunction(() => {
		const cell = document.querySelector('fieldset input[autocomplete="one-time-code"]');
		return !!cell && Object.keys(cell).some((k) => k.startsWith("__reactProps"));
	});
	const group = page.getByRole("group", { name: "Código de verificación" });
	const cells = group.getByRole("textbox");
	const code = () => cells.evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value).join(""));
	return { group, cells, code };
};

test("escribir avanza, Retroceso borra y retrocede, las flechas se mueven", async ({ page }) => {
	const { cells, code } = await open(page);
	await expect(cells).toHaveCount(6);
	await expect.poll(code).toBe("482");

	await cells.nth(3).click();
	await page.keyboard.type("91");
	await expect.poll(code).toBe("48291");
	await expect(cells.nth(5)).toBeFocused();

	await page.keyboard.press("Backspace"); // casilla 6 vacía: borra la 5 y vuelve a ella
	await expect.poll(code).toBe("4829");
	await expect(cells.nth(4)).toBeFocused();

	await page.keyboard.press("ArrowLeft");
	await expect(cells.nth(3)).toBeFocused();
	await page.keyboard.type("x");
	await expect.poll(code).toBe("4829");
});

test("pegar el código entero rellena todas las casillas y enfoca la última", async ({ page }) => {
	const { cells, code } = await open(page);
	// Pegado de verdad: se copia con el teclado desde un campo auxiliar y se pega con el teclado. Un evento `paste`
	// creado por script no sirve en Firefox, que no deja leer su `clipboardData`.
	await page.evaluate(() => {
		const source = document.createElement("input");
		source.id = "fuente-portapapeles";
		source.value = "135790";
		document.body.append(source);
	});
	// Los tres navegadores corren a la vez y pueden compartir el portapapeles del sistema: si otro copia entre
	// nuestro Ctrl+C y nuestro Ctrl+V, se repite el par. Pegar en la primera casilla sobrescribe las seis.
	await expect(async () => {
		await page.locator("#fuente-portapapeles").selectText();
		await page.keyboard.press("ControlOrMeta+C");
		await cells.nth(0).focus();
		await page.keyboard.press("ControlOrMeta+V");
		await expect.poll(code, { timeout: 2_000 }).toBe("135790");
	}).toPass({ timeout: 10_000 });
	await expect(cells.nth(5)).toBeFocused();
});

test("el autocompletado del código en la primera casilla se reparte", async ({ page }) => {
	const { cells, code } = await open(page);
	await cells.nth(0).fill("246810");
	await expect.poll(code).toBe("246810");
	await expect(cells.nth(0)).toHaveAttribute("autocomplete", "one-time-code");
});
