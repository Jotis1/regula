// Pie del rediseño (reference/docs-design/Footer.dc.html), con las versiones reales de los paquetes.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const version = (pkg: string) =>
	(
		JSON.parse(
			readFileSync(join(import.meta.dirname, `../../../packages/${pkg}/package.json`), "utf8"),
		) as {
			version: string;
		}
	).version;
const footer = (page: Page) => page.getByRole("contentinfo");

test("muestra la versión de @jotis-me/react y de los otros dos paquetes", async ({ page }) => {
	await page.goto("/foundations/color/");
	const versions = footer(page).locator("[data-versions]");
	await expect(versions).toContainText(`@jotis-me/react ${version("react")}`);
	await expect(versions).toContainText(`@jotis-me/tokens ${version("tokens")}`);
	await expect(versions).toContainText(`@jotis-me/icons ${version("icons")}`);
	// Nada de los datos inventados del diseño
	await expect(footer(page)).not.toContainText("@jotis/regula");
	await expect(footer(page)).not.toContainText("untitledui");
});

test("enlaza al historial y a la documentación y la suite", async ({ page }) => {
	await page.goto("/");
	await expect(footer(page).getByRole("link", { name: "Qué ha cambiado" })).toHaveAttribute(
		"href",
		"/changelog/",
	);
	const nav = footer(page).getByRole("navigation", { name: "Pie" });
	for (const [name, href] of [
		["Instalación", "/start/install/"],
		["Fundamentos", "/foundations/principles/"],
		["Componentes", "/components/"],
		["Iconos", "/icons/"],
		["Vinculum", "https://vinculum.jotis.me"],
		["Pecunia", "https://pecunia.jotis.me"],
		["Emptor", "https://emptor.jotis.me"],
		["Ornatus", "https://ornatus.jotis.me"],
	] as const)
		await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
	await expect(footer(page)).toContainText("Regula");
});
