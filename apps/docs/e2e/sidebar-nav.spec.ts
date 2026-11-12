// SidebarNav en Chromium real: los submenús se abren con el teclado, el estrecho enseña el nombre en un tooltip y abre
// su segundo panel, la tarjeta de cuenta cambia de cuenta y el menú de la barra adaptable abre la navegación.
import { expect, type Page, test } from "@playwright/test";

test.use({ viewport: { width: 800, height: 900 } });

// Orden de las navegaciones en el ejemplo: simple, estrecho, dos niveles, divisores, subtítulos, adaptable cerrada y abierta
const navs = (page: Page) => page.getByRole("navigation", { name: "Principal" });

const ready = async (page: Page) => {
	await page.goto("/visual/sidebar-nav/");
	await page.waitForFunction(() => {
		const button = document.querySelector("nav button[aria-controls]");
		return !!button && Object.keys(button).some((k) => k.startsWith("__reactProps"));
	});
};

test("el submenú se abre y se cierra con Enter y Espacio, y avisa de su estado", async ({ page }) => {
	await ready(page);
	const simple = navs(page).nth(0);
	const toggle = simple.getByRole("button", { name: "Panel" });
	await expect(toggle).toHaveAttribute("aria-expanded", "true");
	await expect(simple.getByRole("link", { name: "Analítica" })).toBeVisible();
	await toggle.focus();
	await page.keyboard.press("Enter");
	await expect(toggle).toHaveAttribute("aria-expanded", "false");
	await expect(simple.getByRole("link", { name: "Analítica" })).toBeHidden();
	await page.keyboard.press("Space");
	await expect(toggle).toHaveAttribute("aria-expanded", "true");
	await expect(simple.getByRole("link", { name: "Analítica" })).toBeVisible();
});

test("estrecho: el nombre de cada icono sale en un tooltip al enfocarlo con el teclado", async ({ page }) => {
	await ready(page);
	const slim = navs(page).nth(1);
	const link = slim.getByRole("link", { name: "Calendario" });
	await link.focus();
	await page.keyboard.press("Shift+Tab");
	await page.keyboard.press("Tab");
	await expect(link).toBeFocused();
	await expect(page.getByRole("tooltip")).toHaveText("Calendario");
	await page.keyboard.press("Escape");
	await expect(page.getByRole("tooltip")).toHaveCount(0);
});

test("estrecho: el elemento con submenú abre y cierra el segundo panel con el teclado", async ({ page }) => {
	await ready(page);
	const slim = navs(page).nth(1);
	const parent = slim.getByRole("button", { name: "Panel" });
	const panel = slim.getByRole("group", { name: "Panel" });
	await expect(parent).toHaveAttribute("aria-expanded", "true");
	await expect(panel.getByRole("link", { name: "Resumen" })).toBeVisible();
	await parent.focus();
	await page.keyboard.press("Enter");
	await expect(parent).toHaveAttribute("aria-expanded", "false");
	await expect(panel.getByRole("link", { name: "Resumen" })).toBeHidden();
	await page.keyboard.press("Enter");
	await expect(panel.getByRole("link", { name: "Resumen" })).toBeVisible();
});

test("dos niveles: elegir otro elemento con submenú cambia lo que enseña el panel", async ({ page }) => {
	await ready(page);
	const dual = navs(page).nth(2);
	await expect(dual.getByRole("button", { name: "Panel" })).toHaveAttribute("aria-expanded", "true");
	await expect(dual.getByRole("link", { name: "De usuarios" })).toBeVisible();
	await dual.getByRole("button", { name: "Panel" }).click();
	await expect(dual.getByRole("link", { name: "De usuarios" })).toBeHidden();
});

test("la tarjeta de cuenta cambia de cuenta desde el menú", async ({ page }) => {
	await ready(page);
	const simple = navs(page).nth(0);
	const card = simple.getByRole("button", { name: /Olivia Rhye/ });
	await card.click();
	await page.getByRole("menuitemradio", { name: /Sienna Hewitt/ }).click();
	await expect(simple.getByRole("button", { name: /Sienna Hewitt/ })).toBeVisible();
});

test("adaptable: el botón de menú abre y cierra la navegación en pantalla estrecha", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 900 });
	await ready(page);
	const bar = navs(page).nth(5);
	const open = bar.getByRole("button", { name: "Abrir menú" });
	await expect(open).toHaveAttribute("aria-expanded", "false");
	await expect(bar.getByRole("link", { name: "Documentos" })).toBeHidden();
	await open.click();
	await expect(open).toHaveAttribute("aria-expanded", "true");
	await expect(bar.getByRole("link", { name: "Documentos" })).toBeVisible();
	await open.click();
	await expect(bar.getByRole("link", { name: "Documentos" })).toBeHidden();
});
