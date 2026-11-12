// Portada del rediseño (reference/docs-design/Main.dc.html y HomeM.dc.html): las cifras son las de los paquetes.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { colors } from "@jotis-me/tokens";
import { expect, test } from "@playwright/test";
import * as lineIcons from "@untitledui/icons";
import { COMPONENT_GROUPS, FOUNDATIONS } from "../src/lib/catalog";

const components = readdirSync(join(import.meta.dirname, "../src/content/components")).filter((f) =>
	f.endsWith(".md"),
).length;
// Cifras del catálogo, sin números escritos: crecen con cada componente
const iconCount = Object.keys(lineIcons).length;
const appGroups = COMPONENT_GROUPS.filter((g) => g.section === "components");
const appComponents = appGroups.reduce((n, g) => n + g.components.length, 0);

test.use({ viewport: { width: 1440, height: 900 } });

test("las cifras de componentes, iconos y tokens son las de los paquetes", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("[data-counts]")).toContainText(
		`${iconCount} iconos y ${components} componentes para Vinculum`,
	);
	const meta = page.locator("[data-map-meta]");
	await expect(meta.nth(0)).toHaveText(
		`${FOUNDATIONS.length} apartados · ${Object.keys(colors).length} tokens de color`,
	);
	await expect(meta.nth(1)).toHaveText(`${appComponents} de aplicación · ${appGroups.length} grupos`);
	await expect(meta.nth(2)).toHaveText(`${components - appComponents} componentes · guía propia`);
	await expect(meta.nth(3)).toHaveText(`${iconCount} iconos · de Untitled UI, en React`);
});

test("el mensaje principal lleva a la instalación y abre la búsqueda", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Las reglas de la suite, con el código al lado.",
	);
	await expect(page.getByRole("link", { name: "Instalar en tu proyecto" })).toHaveAttribute(
		"href",
		"/start/install/",
	);
	await expect(
		page.locator("astro-island:not([ssr])").filter({ hasText: "Buscar" }).first(),
	).toBeAttached();
	await page.getByRole("button", { name: "Busca lo que te falte" }).click();
	await expect(page.getByRole("dialog", { name: "Buscar en Regula" })).toBeVisible();
});

test("el formulario son componentes de verdad: se puede escribir", async ({ page }) => {
	await page.goto("/");
	const amount = page.getByLabel("Importe");
	await amount.scrollIntoViewIfNeeded();
	await expect(page.locator("astro-island:not([ssr])").filter({ has: amount })).toHaveCount(1);
	await amount.fill("12,00 €");
	await expect(amount).toHaveValue("12,00 €");
	await expect(page.getByText("Ese correo no parece un correo. Revísalo.")).toBeVisible();
});

test("la instalación sale del README, con los paquetes reales", async ({ page }) => {
	await page.goto("/");
	const install = page.locator("section[aria-labelledby='install-t']");
	await expect(install).toContainText("bun add @jotis-me/react");
	await expect(install).toContainText('@import "@jotis-me/react/styles.css";');
	await expect(install).not.toContainText("@jotis/regula");
});

test("las cinco reglas llevan el texto de la guía y las apps su icono", async ({ page }) => {
	await page.goto("/");
	const rules = page.locator("section[aria-labelledby='rules-t'] li");
	await expect(rules).toHaveCount(5);
	await expect(rules.nth(1)).toContainText("Cada vista y cada modal tiene como mucho un Button primary.");
	await expect(rules.nth(3)).toContainText("Un estado siempre lleva palabra o icono además del color.");
	const apps = page.locator("section[aria-labelledby='suite-t'] li");
	await expect(apps).toHaveText([/Ornatus/, /Vinculum/, /Pecunia/, /Emptor/, /Regula/, /Scaena/]);
	await expect(apps.nth(4).locator("svg:visible path").first()).toHaveAttribute("fill", "#4b004f");
});
