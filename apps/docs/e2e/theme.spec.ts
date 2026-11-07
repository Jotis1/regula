// Tema de la web (docs-site, «Tema claro y oscuro»): selector de tres estados en la cabecera, sin parpadeo al cargar.
import { expect, type Page, test } from "@playwright/test";

// Apunta el tema que ya tenía <html> en el momento en que aparece <body>, antes de la primera pintura
const recordThemeAtBody = () => {
	new MutationObserver((_, obs) => {
		if (document.body) {
			const w = window as unknown as { darkAtBody: boolean; temaAtBody: string | undefined };
			w.darkAtBody = document.documentElement.classList.contains("dark-mode");
			w.temaAtBody = document.documentElement.dataset.tema;
			obs.disconnect();
		}
	}).observe(document, { childList: true, subtree: true });
};
const darkAtBody = (page: Page) =>
	page.evaluate(() => (window as unknown as { darkAtBody: boolean }).darkAtBody);
const temaAtBody = (page: Page) =>
	page.evaluate(() => (window as unknown as { temaAtBody: string | undefined }).temaAtBody);

/** El botón del selector una vez hidratado: su nombre dice lo elegido («Tema: Claro»). */
const trigger = (page: Page, elegido: "Sistema" | "Claro" | "Oscuro") =>
	page.getByRole("button", { name: `Tema: ${elegido}`, exact: true });

/** Abre el selector de la cabecera y elige una opción. */
async function choose(
	page: Page,
	actual: "Sistema" | "Claro" | "Oscuro",
	nueva: "Sistema" | "Claro" | "Oscuro",
) {
	await trigger(page, actual).click();
	await page.getByRole("menuitemradio", { name: nueva, exact: true }).click();
	await expect(page.getByRole("menu")).toBeHidden();
	await expect(trigger(page, nueva)).toBeVisible();
}

test("la primera visita sigue la preferencia del sistema", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.addInitScript(recordThemeAtBody);
	await page.goto("/");
	expect(await darkAtBody(page)).toBe(true);
	expect(await temaAtBody(page)).toBe("sistema");
	await page.emulateMedia({ colorScheme: "light" });
	await page.reload();
	expect(await darkAtBody(page)).toBe(false);
});

test("recuerda el tema elegido y carga directamente en él, sin parpadeo", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.addInitScript(recordThemeAtBody);
	await page.goto("/");
	await choose(page, "Sistema", "Oscuro");
	await expect(page.locator("html")).toHaveClass(/dark-mode/);

	await page.reload();
	expect(await darkAtBody(page)).toBe(true);
	// `data-tema` también está antes de la primera pintura: el icono del botón es el bueno desde el principio
	expect(await temaAtBody(page)).toBe("oscuro");
	const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
	expect(bg).toBe("rgb(10, 10, 10)");

	await choose(page, "Oscuro", "Claro");
	await page.reload();
	expect(await darkAtBody(page)).toBe(false);
	expect(await temaAtBody(page)).toBe("claro");
});

test("en escritorio, «Sistema» deja de recordar la elección y sigue al sistema mientras la página está abierta", async ({
	page,
}) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	await choose(page, "Sistema", "Oscuro");
	await expect(page.locator("html")).toHaveClass(/dark-mode/);
	expect(await page.evaluate(() => localStorage.getItem("regula-tema"))).toBe("oscuro");

	// Con el sistema en claro, «Sistema» vuelve a claro y borra lo guardado
	await choose(page, "Oscuro", "Sistema");
	await expect(page.locator("html")).not.toHaveClass(/dark-mode/);
	expect(await page.evaluate(() => localStorage.getItem("regula-tema"))).toBeNull();

	// Y sigue los cambios del sistema sin recargar
	await page.emulateMedia({ colorScheme: "dark" });
	await expect(page.locator("html")).toHaveClass(/dark-mode/);
	await page.emulateMedia({ colorScheme: "light" });
	await expect(page.locator("html")).not.toHaveClass(/dark-mode/);
});

test("el selector dice lo elegido: opción marcada, icono del botón y nombre accesible", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	// Los tres iconos están en el botón; solo se ve el de lo elegido (pantalla, sol, luna)
	const visibleIcon = (elegido: "Sistema" | "Claro" | "Oscuro") =>
		trigger(page, elegido).evaluate((b) =>
			[...b.querySelectorAll("svg")].map((s) => getComputedStyle(s).display !== "none"),
		);
	expect(await visibleIcon("Sistema")).toEqual([true, false, false]);

	await trigger(page, "Sistema").click();
	const checked = (name: string) =>
		page.getByRole("menuitemradio", { name, exact: true }).getAttribute("aria-checked");
	expect([await checked("Sistema"), await checked("Claro"), await checked("Oscuro")]).toEqual([
		"true",
		"false",
		"false",
	]);
	await page.keyboard.press("Escape");

	await choose(page, "Sistema", "Claro");
	expect(await visibleIcon("Claro")).toEqual([false, true, false]);
	await choose(page, "Claro", "Oscuro");
	expect(await visibleIcon("Oscuro")).toEqual([false, false, true]);
});

test("con el teclado: Enter abre, las flechas recorren, Enter elige y el foco vuelve al botón", async ({
	page,
}) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	await expect(trigger(page, "Sistema")).toBeVisible();
	await trigger(page, "Sistema").focus();
	await page.keyboard.press("Enter");
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect(page.locator("html")).toHaveClass(/dark-mode/);
	await expect(trigger(page, "Oscuro")).toBeFocused();
});
