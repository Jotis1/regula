// Dropdown en Chromium real: la búsqueda dentro del menú no pierde el foco al filtrar y las cuentas se cambian con el
// teclado. Las vistas previas abren el menú en línea (`defaultOpen`), así que se prueba el menú que abre el usuario.
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1000, height: 900 } });

const ready = async (page: import("@playwright/test").Page) => {
	await page.goto("/visual/dropdown/");
	await page.waitForFunction(() => {
		const button = document.querySelector("button[aria-haspopup]");
		return !!button && Object.keys(button).some((k) => k.startsWith("__reactProps"));
	});
};

test("con searchable, escribir filtra las opciones y el foco sigue en el buscador", async ({ page }) => {
	await ready(page);
	// Se cierran los menús en línea para dejar solo lo que abra el usuario
	await page.mouse.click(5, 5);
	const search = page.getByRole("searchbox", { name: "Buscar" });
	await expect(search).toBeVisible();
	await search.fill("ven");
	await expect(search).toBeFocused();
	const group = page.getByRole("group", { name: "Equipos" });
	await expect(group.getByRole("menuitem")).toHaveText(["Ventas"]);
	await search.fill("zzz");
	await expect(page.getByText("Sin resultados")).toBeVisible();
});

test("el menú de cuentas se abre con el teclado y cambia de cuenta", async ({ page }) => {
	await ready(page);
	// Las migas son el último disparador de cuenta de la vista previa y su menú empieza cerrado
	const trigger = page.getByRole("button", { name: /Olivia Rhye/ }).last();
	await trigger.focus();
	await page.keyboard.press("Enter");
	const menu = page.getByRole("dialog").getByRole("menu");
	await expect(menu).toBeVisible();
	await expect(menu.getByRole("menuitemradio", { name: /Olivia Rhye/ })).toHaveAttribute(
		"aria-checked",
		"true",
	);
	await menu.getByRole("menuitemradio", { name: /Sienna Hewitt/ }).click();
	await expect(menu).toHaveCount(0);
	await expect(page.getByRole("button", { name: /Sienna Hewitt/ }).last()).toBeVisible();
});
