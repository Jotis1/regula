// Páginas de componente: ficha, ejemplos vivos, props, fragmentos de código y navegación.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const dir = join(import.meta.dirname, "../src/content/components");
const pages = readdirSync(dir).map((f) => ({
	slug: f.replace(/\.md$/, ""),
	name: (readFileSync(join(dir, f), "utf8").match(/^name: (.+)$/m) as RegExpMatchArray)[1] as string,
}));

test("la navegación lateral lista todas las páginas de componente", async ({ page }) => {
	await page.goto("/");
	const nav = page.getByRole("navigation", { name: "Documentación" });
	for (const { name, slug } of pages)
		await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute(
			"href",
			`/components/${slug}/`,
		);
});

for (const { slug, name } of pages) {
	test(`${name}: ficha, ejemplos vivos, props y código`, async ({ page }) => {
		await page.goto(`/components/${slug}/`);
		// La primera: el ejemplo de PageHeader pinta su propio <h1>
		await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(name);
		await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "page");
		// La isla de ejemplos se hidrata al verse: después tiene contenido
		const examples = page.locator("#ejemplos + div astro-island");
		await examples.scrollIntoViewIfNeeded();
		await expect(examples).not.toHaveAttribute("ssr", /.*/);
		await expect(examples.locator(":scope > *").first()).toBeVisible();
		expect(await page.locator("section[aria-labelledby=props] tbody tr").count()).toBeGreaterThan(0);
		const code = page.locator("[data-code-tabs]");
		await expect(code.getByRole("tabpanel")).toContainText(`import { ${name} } from "@jotis-me/react";`);
	});
}

test("los ejemplos vivos no heredan los estilos del texto largo (tablas, listas, párrafos)", async ({
	page,
}) => {
	await page.goto("/components/date-picker/");
	const grid = page.locator("#ejemplos + div table");
	await grid.scrollIntoViewIfNeeded();
	const css = await grid.evaluate((t) => {
		const th = t.querySelector("th") as Element;
		return {
			border: getComputedStyle(t).borderTopWidth,
			thPadding: getComputedStyle(th).paddingLeft,
			thBg: getComputedStyle(th).backgroundColor,
		};
	});
	expect(css).toEqual({ border: "0px", thPadding: "0px", thBg: "rgba(0, 0, 0, 0)" });
	await page.goto("/components/text-editor/");
	const li = page.locator("#ejemplos + div [role=textbox] li").first();
	await li.scrollIntoViewIfNeeded();
	expect(await li.evaluate((e) => getComputedStyle(e).paddingLeft)).toBe("0px");
});

test("Button: cinco jerarquías y cinco tamaños vivos, la regla de una primaria y sus props", async ({
	page,
}) => {
	await page.goto("/components/button/");
	const examples = page.locator("#ejemplos + div");
	for (const label of ["Guardar", "Cancelar", "Más tarde", "Ver detalles", "Ayuda", "xs", "sm", "xl"])
		await expect(examples.getByRole("button", { name: label, exact: true })).toBeVisible();
	await expect(examples.getByRole("button", { name: "Nuevo gasto" })).toHaveCSS("height", "40px");
	await expect(examples.getByRole("button", { name: "Continuar" })).toHaveCSS("height", "44px");
	await expect(page.locator("section[aria-labelledby=ficha]")).toContainText(
		"Una sola primary por vista o por modal",
	);
	const props = await page
		.locator("section[aria-labelledby=props] tbody tr td:first-child code")
		.allTextContents();
	for (const p of ["hierarchy", "size", "destructive", "iconOnly", "loading", "href"])
		expect(props).toContain(p);
});

test("pestañas de código: flechas para cambiar, Astro con client:load en un interactivo", async ({
	page,
}) => {
	await page.goto("/components/button-group/");
	const tabs = page.locator("[data-code-tabs]").getByRole("tab");
	const next = tabs.nth(0);
	const astro = tabs.nth(1);
	await next.focus();
	await page.keyboard.press("ArrowRight");
	await expect(astro).toBeFocused();
	await expect(astro).toHaveAttribute("aria-selected", "true");
	await expect(next).toHaveAttribute("tabindex", "-1");
	const panel = page.locator("[data-code-tabs]").getByRole("tabpanel");
	await expect(panel).toHaveCount(1);
	await expect(panel).toContainText("<ButtonGroup client:load");
	await page.keyboard.press("ArrowRight");
	await expect(next).toBeFocused();
	await expect(panel).toContainText("export default function Page()");
	await page.keyboard.press("ArrowLeft");
	await expect(astro).toHaveAttribute("aria-selected", "true");
});

test("los estáticos no llevan directiva en Astro y avisan si necesitan una función", async ({ page }) => {
	await page.goto("/components/badge/");
	await page.locator("[data-code-tabs]").getByRole("tab", { name: "Astro" }).click();
	const panel = page.locator("[data-code-tabs]").getByRole("tabpanel");
	await expect(panel).not.toContainText("client:");
	await expect(page.locator("section[aria-labelledby=codigo]")).toContainText("onRemove");
});
