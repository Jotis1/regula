// Select en Chromium, Firefox y WebKit: abrir la lista, elegir con el ratón y con el teclado, y que el valor llegue al
// <select> oculto que React Aria pinta para los formularios (lo que se envía con `name`).
import type { Page } from "@playwright/test";
import { expect, test } from "../fixtures";

const open = async (page: Page) => {
	await page.goto("/visual/select/");
	// Hidratado de verdad: sin los props de React colgados del botón, pulsar no abre nada.
	await page.waitForFunction(() => {
		const button = document.querySelector("button[aria-haspopup=listbox]");
		return !!button && window.islandReady(button);
	});
	// El ejemplo trae una lista abierta de inicio: Escape, pulsado dentro de ella, la cierra (WebKit no lo recibe sin foco).
	await page.getByRole("listbox").press("Escape");
	await expect(page.getByRole("listbox")).toHaveCount(0);
	const field = page.getByRole("button", { name: /Categoría/ }).first();
	const hidden = page.locator("select").first();
	return { field, hidden };
};

test("el ratón abre la lista, elige y el valor llega al <select> oculto", async ({ page }) => {
	const { field, hidden } = await open(page);
	await expect(field).toContainText("Elige una");
	await field.click();
	await expect(page.getByRole("listbox")).toBeVisible();
	await page.getByRole("option", { name: "Ocio" }).click();
	await expect(page.getByRole("listbox")).toHaveCount(0);
	await expect(field).toContainText("Ocio");
	await expect(field).toBeFocused();
	await expect(hidden).toHaveValue("Ocio");
});

test("el teclado abre con ↓, elige con Enter y Escape cierra sin cambiar", async ({ page }) => {
	const { field, hidden } = await open(page);
	await field.focus();
	await page.keyboard.press("ArrowDown");
	await expect(page.getByRole("listbox")).toBeVisible();
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect(field).toContainText(/Hogar|Transporte/);
	const chosen = await hidden.inputValue();
	expect(chosen).not.toBe("");
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Escape");
	await expect(page.getByRole("listbox")).toHaveCount(0);
	await expect(hidden).toHaveValue(chosen);
});
