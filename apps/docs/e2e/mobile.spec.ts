// Cabecera móvil y menú a pantalla completa (reference/docs-design/HeaderM.dc.html y MobileMenu.dc.html), con el
// tema en tres estados (design §7 y §8).
import { expect, type Page, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

const menuButton = (page: Page) => page.getByRole("button", { name: "Abrir menú" });
const menu = (page: Page) => page.getByRole("dialog", { name: "Regula", exact: true });

async function openMenu(page: Page) {
	// El botón es de una isla que se hidrata en pantallas estrechas
	await expect(page.locator("astro-island[component-url*='MobileMenu']:not([ssr])")).toHaveCount(1);
	await menuButton(page).click();
	await expect(menu(page)).toBeVisible();
}

test("la cabecera móvil tiene marca, búsqueda, tema y menú, sin las secciones", async ({ page }) => {
	await page.goto("/foundations/color/");
	const header = page.locator("body > header");
	expect((await header.boundingBox())?.height).toBe(56);
	await expect(header.getByRole("link", { name: "Regula, portada" })).toBeVisible();
	await expect(header.getByRole("button", { name: /Buscar en Regula/ })).toBeVisible();
	await expect(header.getByRole("button", { name: /Usar tema/ })).toBeVisible();
	await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
	await expect(page.getByRole("navigation", { name: "Secciones" })).toBeHidden();
	// La navegación lateral de escritorio no se ve: está en el menú
	await expect(page.locator("aside")).toBeHidden();
});

test("el menú atrapa el foco, se cierra con Escape y devuelve el foco al botón", async ({ page }) => {
	await page.goto("/foundations/color/");
	await openMenu(page);
	await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
	for (let i = 0; i < 25; i++) {
		await page.keyboard.press("Tab");
		const inside = await menu(page).evaluate((d) => d.contains(document.activeElement));
		expect(inside, `Tab ${i + 1}`).toBe(true);
	}
	await page.keyboard.press("Escape");
	await expect(menu(page)).toBeHidden();
	await expect(menuButton(page)).toBeFocused();
	await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
});

test("el menú lleva la navegación con su filtro y navega", async ({ page }) => {
	await page.goto("/foundations/color/");
	await openMenu(page);
	const nav = menu(page).getByRole("navigation", { name: "Documentación" });
	await expect(nav.getByRole("link", { name: "Color", exact: true })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await nav.getByLabel("Filtrar navegación").fill("tabla");
	await expect(nav.getByRole("link", { name: "Table", exact: true })).toBeVisible();
	await expect(nav.getByRole("link", { name: "Color", exact: true })).toBeHidden();
	await nav.getByRole("link", { name: "Table", exact: true }).click();
	await expect(page).toHaveURL(/\/components\/table\/$/);
});

test("la búsqueda del menú abre la búsqueda global", async ({ page }) => {
	await page.goto("/");
	await expect(
		page.locator("astro-island:not([ssr])").filter({ hasText: "Buscar" }).first(),
	).toBeAttached();
	await openMenu(page);
	await menu(page).getByRole("button", { name: "Buscar en Regula" }).click();
	await expect(menu(page)).toBeHidden();
	await expect(page.getByRole("dialog", { name: "Buscar en Regula" })).toBeVisible();
});

test("«Sistema» sigue al sistema y borra la elección guardada", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	await openMenu(page);
	const theme = menu(page).getByRole("group", { name: "Tema" });
	await expect(theme.getByRole("button", { name: "Sistema" })).toHaveAttribute("aria-pressed", "true");

	await theme.getByRole("button", { name: "Oscuro" }).click();
	await expect(page.locator("html")).toHaveClass(/dark-mode/);
	expect(await page.evaluate(() => localStorage.getItem("regula-tema"))).toBe("oscuro");

	// Con el sistema en claro, "Sistema" vuelve a claro y deja de recordar
	await theme.getByRole("button", { name: "Sistema" }).click();
	await expect(page.locator("html")).not.toHaveClass(/dark-mode/);
	expect(await page.evaluate(() => localStorage.getItem("regula-tema"))).toBeNull();

	// Y sigue los cambios del sistema mientras no haya elección
	await page.emulateMedia({ colorScheme: "dark" });
	await expect(page.locator("html")).toHaveClass(/dark-mode/);
	await page.emulateMedia({ colorScheme: "light" });
	await expect(page.locator("html")).not.toHaveClass(/dark-mode/);
});

test("con una elección guardada el cambio del sistema no manda", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	await openMenu(page);
	await menu(page).getByRole("group", { name: "Tema" }).getByRole("button", { name: "Claro" }).click();
	await page.emulateMedia({ colorScheme: "dark" });
	await expect(page.locator("html")).not.toHaveClass(/dark-mode/);
	await page.reload();
	await expect(page.locator("html")).not.toHaveClass(/dark-mode/);
});
