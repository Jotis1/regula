import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const manifest = (route: string) =>
	readFileSync(
		join(import.meta.dirname, `../.next/server/app/${route}page_client-reference-manifest.js`),
		"utf8",
	);

/** Recoge errores y avisos de la consola (hidratación incluida) mientras dura la prueba. */
function watchConsole(page: Page): string[] {
	const problems: string[] = [];
	page.on("console", (m) => {
		if (m.type() === "error" || m.type() === "warning") problems.push(m.text());
	});
	page.on("pageerror", (e) => problems.push(e.message));
	return problems;
}

test("página de servidor con componentes estáticos, sin JavaScript de ellos", async ({ page }) => {
	const problems = watchConsole(page);
	await page.goto("/");
	const save = page.getByRole("button", { name: "Nuevo gasto" });
	await expect(save).toBeVisible();
	expect(await save.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe("rgb(79, 57, 246)");
	await expect(page.getByRole("link", { name: "Ver los interactivos" })).toHaveAttribute(
		"href",
		"/interactivo",
	);
	await expect(page.getByRole("button", { name: "Cerrar" })).toBeVisible();
	await expect(page.getByRole("img", { name: "Correcto" })).toBeVisible();
	// Ningún componente del paquete entra como componente de cliente en esta página
	expect(manifest("")).not.toMatch(/packages\/react\/dist\/components\//);
	expect(problems).toEqual([]);
});

test("componente interactivo importado desde una página de servidor: hidrata y responde", async ({
	page,
}) => {
	const problems = watchConsole(page);
	await page.goto("/interactivo");
	expect(manifest("interactivo/")).toMatch(/packages\/react\/dist\/components\/ButtonGroup\.js/);
	const day = page.getByRole("button", { name: "24 horas" });
	await expect(page.getByRole("button", { name: "7 días" })).toHaveAttribute("aria-pressed", "true");
	await day.click();
	await expect(day).toHaveAttribute("aria-pressed", "true");
	await page.keyboard.press("Shift+Tab");
	await page.keyboard.press("Enter");
	await expect(page.getByRole("button", { name: "7 días" })).toHaveAttribute("aria-pressed", "true");
	expect(problems).toEqual([]);
});

test("Modal en una página de servidor: foco atrapado, Escape, foco de vuelta y página bloqueada", async ({
	page,
}) => {
	const problems = watchConsole(page);
	await page.goto("/interactivo");
	const opener = page.getByRole("button", { name: "Eliminar gasto" });
	await opener.click();
	const dialog = page.getByRole("dialog", { name: "¿Eliminar este gasto?" });
	await expect(dialog).toBeVisible();
	// Fondo bg-overlay al 70 % con desenfoque de 16px
	const backdrop = await dialog.evaluate((d) => {
		let el: Element | null = d;
		while (el && !getComputedStyle(el).backdropFilter.includes("blur")) el = el.parentElement;
		return el
			? { filter: getComputedStyle(el).backdropFilter, bg: getComputedStyle(el).backgroundColor }
			: null;
	});
	expect(backdrop?.filter).toBe("blur(16px)");
	expect(backdrop?.bg).toMatch(/0\.7\)$/);
	expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");
	for (let i = 0; i < 6; i++) {
		await page.keyboard.press("Tab");
		expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
	}
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveCount(0);
	await expect(opener).toBeFocused();
	// La X y "Cancelar" también cierran
	await opener.click();
	await page.getByRole("button", { name: "Cerrar" }).click();
	await expect(dialog).toHaveCount(0);
	expect(problems).toEqual([]);
});
