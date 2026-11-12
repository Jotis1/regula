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

/** El botón del selector: su nombre dice lo elegido («Tema: Claro») ya desde el HTML, antes de hidratar. */
const trigger = (page: Page, elegido: "Sistema" | "Claro" | "Oscuro") =>
	page.getByRole("button", { name: `Tema: ${elegido}`, exact: true });

/** Espera a que la isla del selector esté hidratada: antes, el botón no abre nada. */
const hydrated = async (page: Page) => {
	// La cabecera lleva una isla del selector por versión (escritorio y móvil): se esperan las dos
	const islands = page.locator("body > header astro-island").filter({ hasText: "Tema:" });
	await expect(islands).toHaveCount(2);
	for (const island of await islands.all()) await expect(island).not.toHaveAttribute("ssr", /.*/);
};

/** Abre el selector de la cabecera y elige una opción. */
async function choose(
	page: Page,
	actual: "Sistema" | "Claro" | "Oscuro",
	nueva: "Sistema" | "Claro" | "Oscuro",
) {
	await hydrated(page);
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

/**
 * Lo que se ve en el botón: tiene los tres iconos (en el hueco de icono del Button) y los tres nombres, y solo deben
 * verse el icono y el nombre de lo elegido. Devuelve los nombres visibles y, de los tres iconos, cuáles se ven.
 */
const shownLabels = (page: Page, elegido: "Sistema" | "Claro" | "Oscuro") =>
	trigger(page, elegido).evaluate((b) => {
		const names = ["Sistema", "Claro", "Oscuro"];
		const visible = (el: Element) => getComputedStyle(el).display !== "none";
		return {
			text: [...b.querySelectorAll("span > span:not(.sr-only)")]
				.filter(visible)
				.map((s) => s.textContent),
			icon: [...b.querySelectorAll(":scope > svg")]
				.slice(0, 3)
				.map((s, i) => (visible(s) ? names[i] : null))
				.filter(Boolean),
		};
	});

test("el selector dice lo elegido: opción marcada, icono y nombre en el botón y nombre accesible", async ({
	page,
}) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	expect(await shownLabels(page, "Sistema")).toEqual({ text: ["Sistema"], icon: ["Sistema"] });
	// Texto e icono centrados en vertical en el botón, como en cualquier Button (antes el texto iba descolocado)
	const offsets = await trigger(page, "Sistema").evaluate((b) => {
		const mid = (r: DOMRect) => r.top + r.height / 2;
		const box = b.getBoundingClientRect();
		// Las letras del nombre que se ve (no la caja que las contiene, que podría cuadrar con el texto descolocado)
		const shown = [...b.querySelectorAll("span > span:not(.sr-only)")].find(
			(s) => getComputedStyle(s).display !== "none",
		);
		const range = document.createRange();
		range.selectNodeContents(shown as Element);
		const icon = [...b.querySelectorAll(":scope > svg")].find(
			(s) => getComputedStyle(s).display !== "none",
		);
		return [
			mid(range.getBoundingClientRect()) - mid(box),
			mid((icon as Element).getBoundingClientRect()) - mid(box),
		].map((d) => Math.abs(d));
	});
	for (const d of offsets) expect(d).toBeLessThanOrEqual(1);

	await hydrated(page);
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
	expect(await shownLabels(page, "Claro")).toEqual({ text: ["Claro"], icon: ["Claro"] });
	await choose(page, "Claro", "Oscuro");
	expect(await shownLabels(page, "Oscuro")).toEqual({ text: ["Oscuro"], icon: ["Oscuro"] });
});

test("el botón dice lo elegido antes de hidratar: sin el JavaScript de las islas, «Oscuro» guardado se ve", async ({
	page,
}) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	await choose(page, "Sistema", "Oscuro");
	// Sin los módulos de las islas solo corre el script de <head>: el botón se queda como lo pintó el servidor
	await page.route("**/_astro/*.js", (route) => route.abort());
	await page.reload();
	await expect(
		page.locator("body > header astro-island").filter({ hasText: "Tema:" }).first(),
	).toHaveAttribute("ssr", "");
	expect(await shownLabels(page, "Oscuro")).toEqual({ text: ["Oscuro"], icon: ["Oscuro"] });
});

test("con el teclado: Enter abre, las flechas recorren, Enter elige y el foco vuelve al botón", async ({
	page,
}) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	await hydrated(page);
	await trigger(page, "Sistema").focus();
	await page.keyboard.press("Enter");
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect(page.locator("html")).toHaveClass(/dark-mode/);
	await expect(trigger(page, "Oscuro")).toBeFocused();
});

test("cambiar de tema no mueve la búsqueda: el botón, que cambia de ancho, va a su izquierda", async ({
	page,
}) => {
	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 800 });
		await page.goto("/");
		const search = page.locator("body > header").getByRole("button", { name: /Buscar/ });
		const before = await search.boundingBox();
		await choose(page, "Sistema", "Claro");
		expect(await search.boundingBox()).toEqual(before);
		await choose(page, "Claro", "Oscuro");
		expect(await search.boundingBox()).toEqual(before);
		await choose(page, "Oscuro", "Sistema");
	}
});
