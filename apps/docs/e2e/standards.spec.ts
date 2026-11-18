// Standards section (spec docs-site, «Sección de normas»): index, rule pages with anchors, and search.
import type { Page } from "@playwright/test";
import { STANDARD_AREAS } from "../src/lib/catalog";
import { expect, test } from "./fixtures";

test.use({ viewport: { width: 1440, height: 900 } });

test("el índice lista las áreas con sus normas y cada una enlaza a su ancla", async ({ page }) => {
	await page.goto("/standards/");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Normas");
	// Exact: a short label such as "CI" would also match "Documentación". Only the main content: the footer has its own h2
	for (const area of STANDARD_AREAS)
		await expect(
			page.getByRole("main").getByRole("heading", { level: 2, name: area.label, exact: true }),
		).toBeVisible();
	const first = page.getByRole("link", { name: /NAM-001/ });
	await expect(first).toHaveAttribute("href", "/standards/naming/#nam-001");
	// The level is text, not only colour
	await expect(page.locator('[data-area="naming"] li').first()).toContainText("Debe");
});

test("la cabecera marca Normas como sección actual", async ({ page }) => {
	await page.goto("/standards/git/");
	await expect(
		page.getByRole("navigation", { name: "Secciones" }).getByRole("link", { name: "Normas" }),
	).toHaveAttribute("aria-current", "page");
});

test("/standards/git/#git-001 baja hasta la norma con todos sus datos", async ({ page }) => {
	await page.goto("/standards/git/#git-001");
	const rule = page.locator("#git-001");
	await expect(rule.getByRole("heading", { level: 2 })).toContainText("GIT-001");
	await expect(rule).toContainText("Debe");
	await expect(rule).toContainText("Todos los proyectos");
	await expect(rule).toContainText("Por qué.");
	await expect(rule).toContainText("Esto sí");
	await expect(rule).toContainText("Esto no");
	await expect(rule).toContainText("feat(react): ChatBox dice qué hace el clic");
	await expect(rule).toContainText("Arreglos en la propuesta");
	await expect(rule).toContainText("Cómo se verifica.");
	await expect(rule).toBeInViewport();
});

test("el índice de la página enlaza a cada norma del área", async ({ page }) => {
	await page.goto("/standards/language/");
	const toc = page.getByRole("navigation", { name: "En esta página" });
	for (const id of ["LNG-001", "LNG-002", "LNG-003", "LNG-004"])
		await expect(toc.getByRole("link", { name: id })).toHaveAttribute("href", `#${id.toLowerCase()}`);
});

async function search(page: Page, text: string) {
	await page.goto("/foundations/color/");
	await expect(page.locator("astro-island:not([ssr])").filter({ hasText: "Buscar" })).toHaveCount(2);
	const dialog = page.getByRole("dialog", { name: "Buscar en Regula" });
	await expect(async () => {
		if (!(await dialog.isVisible())) await page.keyboard.press("Control+k");
		await expect(dialog).toBeVisible({ timeout: 2_000 });
	}).toPass({ timeout: 20_000 });
	await page.keyboard.type(text);
}

for (const text of ["NAM-001", "dominio inverso"])
	test(`Ctrl+K con «${text}» encuentra la norma de los paquetes privados`, async ({ page }) => {
		await search(page, text);
		await expect(page.getByRole("group", { name: "Normas" })).toBeVisible();
		await expect(page.getByRole("option").first()).toHaveAccessibleName(/^NAM-001/);
		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/\/standards\/naming\/#nam-001$/);
		await expect(page.locator("#nam-001")).toBeInViewport();
	});

// LNG-004: the web's routes and parameters are in English (spec docs-site, «URLs de la web en inglés»)
test("la ruta antigua de composiciones redirige a /compositions/", async ({ page }) => {
	await page.goto("/components/modal/composiciones/");
	await expect(page).toHaveURL(/\/components\/modal\/compositions\/?$/);
	await expect(page.getByRole("heading", { level: 1 })).toContainText("Modal");
});

test("/visual/…/?theme=dark pinta el ejemplo en oscuro", async ({ page }) => {
	await page.goto("/visual/button/?theme=dark");
	await expect(page.locator("html")).toHaveClass(/dark-mode/);
	await page.goto("/visual/button/");
	await expect(page.locator("html")).not.toHaveClass(/dark-mode/);
});
