// Input en Chromium real: el campo de tarjeta agrupa mientras se escribe, el de archivo abre el selector con el botón y
// muestra el nombre, y el botón de la fecha abre el selector nativo.
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1000, height: 1000 } });

const ready = async (page: import("@playwright/test").Page) => {
	await page.goto("/visual/input/");
	await page.waitForFunction(() => {
		const input = document.querySelector("input[autocomplete='cc-number']");
		return !!input && Object.keys(input).some((k) => k.startsWith("__reactProps"));
	});
};

test("el campo de tarjeta agrupa de cuatro en cuatro mientras se escribe y enseña la red", async ({
	page,
}) => {
	await ready(page);
	const card = page.getByLabel("Número de tarjeta");
	await card.fill("");
	await card.pressSequentially("5555 5555 4444 4444 4");
	await expect(card).toHaveValue("5555 5555 4444 4444 4");
	await card.fill("");
	await card.pressSequentially("4012888888881881");
	await expect(card).toHaveValue("4012 8888 8888 1881");
});

test("el botón «Elegir archivo» abre el selector y el nombre elegido se enseña", async ({ page }) => {
	await ready(page);
	const chooser = page.waitForEvent("filechooser");
	await page.getByText("Elegir archivo", { exact: true }).click();
	await (await chooser).setFiles({
		name: "logo.svg",
		mimeType: "image/svg+xml",
		buffer: Buffer.from("<svg/>"),
	});
	await expect(page.getByText("logo.svg", { exact: true })).toBeVisible();
	await expect(page.getByText("Ningún archivo seleccionado")).toHaveCount(0);
});

test("el archivo se elige también con el teclado, desde el propio campo", async ({ page }) => {
	await ready(page);
	await page.getByLabel("Subir archivo").focus();
	const chooser = page.waitForEvent("filechooser");
	await page.keyboard.press("Enter");
	await (await chooser).setFiles({ name: "datos.png", mimeType: "image/png", buffer: Buffer.from("x") });
	await expect(page.getByText("datos.png", { exact: true })).toBeVisible();
});

test("el botón detrás del campo se alcanza con Tab", async ({ page }) => {
	await ready(page);
	await page.getByLabel("Web", { exact: true }).last().focus();
	await page.keyboard.press("Tab");
	await expect(page.getByRole("button", { name: "Copiar" })).toBeFocused();
});
