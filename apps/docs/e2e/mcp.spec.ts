// Guide page of the MCP server (spec docs-site, «Página del MCP»). Axe runs on it in both themes through the crawl of
// a11y.spec.ts, which covers every built page.
import { expect, test } from "@playwright/test";
import { TOOLS } from "../src/features/mcp/tools";

test.use({ viewport: { width: 1440, height: 900 } });

const COMMAND = "claude mcp add --transport http regula https://regula.jotis.me/mcp";

test("/start/mcp/ explica la conexión y lista todas las herramientas", async ({ page }) => {
	await page.goto("/start/mcp/");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Servidor MCP");
	await expect(page.getByRole("heading", { level: 2, name: "Conectar desde Claude Code" })).toBeVisible();
	await expect(page.locator("[data-code]").first()).toContainText(COMMAND);
	// One entry per tool of the server: the page is built from the same registry. `search` is also a prefix of two
	// other names, so the term is matched whole.
	for (const tool of TOOLS)
		await expect(page.locator("dt", { hasText: new RegExp(`^${tool.name}$`) })).toBeVisible();
	await expect(page.locator("dt", { hasText: "/standards.json" })).toBeVisible();
});

test("el comando de Claude Code se copia entero", async ({ page, context }) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/start/mcp/");
	const block = page.locator("[data-code]").first();
	// CodeSnippet is an island `client:visible`: its button answers once it is hydrated
	await expect(block.locator("astro-island")).not.toHaveAttribute("ssr", /.*/);
	await block.getByRole("button", { name: "Copiar" }).click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(COMMAND);
});

test("la navegación lateral marca la página dentro de Empezar", async ({ page }) => {
	await page.goto("/start/mcp/");
	const nav = page.getByRole("navigation", { name: "Documentación" });
	await expect(nav.getByRole("link", { name: "Servidor MCP", exact: true })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await expect(
		page.getByRole("navigation", { name: "Secciones" }).getByRole("link", { name: "Empezar" }),
	).toHaveAttribute("aria-current", "page");
});

test("Ctrl+K con «mcp» lleva a la página", async ({ page }) => {
	await page.goto("/foundations/color/");
	await expect(page.locator("astro-island:not([ssr])").filter({ hasText: "Buscar" })).toHaveCount(2);
	const dialog = page.getByRole("dialog", { name: "Buscar en Regula" });
	await expect(async () => {
		if (!(await dialog.isVisible())) await page.keyboard.press("Control+k");
		await expect(dialog).toBeVisible({ timeout: 2_000 });
	}).toPass({ timeout: 20_000 });
	await page.keyboard.type("mcp");
	await page
		.getByRole("option", { name: /Servidor MCP/ })
		.first()
		.click();
	await expect(page).toHaveURL(/\/start\/mcp\/$/);
});

test("vuelve a la instalación y no se mete en el recorrido de lectura", async ({ page }) => {
	await page.goto("/start/mcp/");
	await expect(page.locator("article").getByRole("link", { name: /Instalación/ })).toHaveAttribute(
		"href",
		"/start/install/",
	);
	// El siguiente de la instalación sigue siendo Principios
	await page.goto("/start/install/");
	await expect(page.locator("article").getByRole("link", { name: /Principios/ })).toBeVisible();
});
