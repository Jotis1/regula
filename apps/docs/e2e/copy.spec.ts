// Copiar con aviso (component-library, «Copiar con aviso junto a lo pulsado»): la burbuja «Copiado» del paquete sale
// sobre el botón pulsado, tanto en HTML estático (las tablas de tokens) como dentro de una isla (la galería de iconos).
import { expect, type Locator, type Page, test } from "@playwright/test";

/** La burbuja es una isla `client:idle`: hasta que se hidrata, un clic en un `data-copy` no copia nada. */
async function hydrated(page: Page) {
	// La isla de la página (Base, `CopyTooltipIsland`): una página puede llevar más CopyTooltip dentro de otras islas
	await expect(page.locator("astro-island[component-url*=CopyTooltipIsland]")).not.toHaveAttribute(
		"ssr",
		/.*/,
	);
}

const tooltip = (page: Page) => page.locator("[data-copy-tooltip]");

/** Pulsa el botón, ya en mitad de la ventana (desplazar antes: desplazar después quita la burbuja). */
async function copyFrom(button: Locator) {
	await button.evaluate((el) => el.scrollIntoView({ block: "center" }));
	await button.click();
}

/** La burbuja queda centrada sobre el botón, a 10px, y con su flecha apuntándole. */
async function expectAbove(page: Page, button: Locator) {
	const bubble = await tooltip(page).locator("> span").boundingBox();
	const target = await button.boundingBox();
	expect(bubble).not.toBeNull();
	expect(target).not.toBeNull();
	if (!bubble || !target) return;
	expect(Math.abs(bubble.x + bubble.width / 2 - (target.x + target.width / 2))).toBeLessThanOrEqual(2);
	expect(Math.abs(target.y - (bubble.y + bubble.height) - 10)).toBeLessThanOrEqual(3);
}

for (const scheme of ["light", "dark"] as const) {
	test(`${scheme}: en una tabla de tokens (HTML estático) la burbuja sale sobre el botón pulsado`, async ({
		page,
		context,
	}) => {
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
		await page.emulateMedia({ colorScheme: scheme });
		await page.goto("/foundations/color/");
		await hydrated(page);
		// El explorador se abre por Texto; el botón de `TokenSwatch` se llama como su utilidad
		const button = page.getByRole("button", { name: "text-primary", exact: true });
		await copyFrom(button);
		await expect(tooltip(page)).toHaveText("Copiado");
		await expectAbove(page, button);
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("text-primary");
		// Se va sola
		await expect(tooltip(page)).toHaveText("", { timeout: 4000 });
	});

	test(`${scheme}: en la galería de iconos (una isla) la burbuja sale sobre el botón pulsado`, async ({
		page,
		context,
	}) => {
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
		await page.emulateMedia({ colorScheme: scheme });
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto("/icons/");
		await expect(
			page.locator("astro-island").filter({ has: page.locator("#icon-search") }),
		).not.toHaveAttribute("ssr", /.*/);
		await hydrated(page);
		// La galería enseña los primeros iconos: «calendar» se busca
		await page.getByLabel("Buscar icono").fill("calendar");
		await page.locator('[data-item="Calendar"] button').click();
		const button = page.getByRole("button", { name: "Copiar nombre" });
		await copyFrom(button);
		await expect(tooltip(page)).toHaveText("Copiado");
		await expectAbove(page, button);
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("Calendar");
	});
}

test("un valor largo no ensancha la burbuja: sigue diciendo solo «Copiado»", async ({ page, context }) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/foundations/color/");
	await hydrated(page);
	// Mide con un token corto y con el copiado más largo de la tabla: la burbuja mide lo mismo
	// La utilidad de cada token es un botón de `TokenSwatch`, que copia su propio texto
	const buttons = page.locator("table:visible button");
	const lengths = await buttons.evaluateAll((els) => els.map((e) => (e.textContent ?? "").length));
	const shortest = lengths.indexOf(Math.min(...lengths));
	const longest = lengths.indexOf(Math.max(...lengths));
	expect(lengths[longest]).toBeGreaterThan((lengths[shortest] ?? 0) + 5);
	const width = async (i: number) => {
		await copyFrom(buttons.nth(i));
		await expect(tooltip(page)).toHaveText("Copiado");
		return (await tooltip(page).locator("> span").boundingBox())?.width;
	};
	const short = await width(shortest);
	await expect(tooltip(page)).toHaveText("", { timeout: 4000 });
	const long = await width(longest);
	expect(long).toBe(short);
});

test("la página de CopyTooltip: useCopy desde una isla y, con dos CopyTooltip montados, una sola burbuja", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/components/copy-tooltip/");
	// La isla del ejemplo interactivo (con su botón y su CopyTooltip) y la de la página tienen que estar hidratadas
	const example = page.locator("section[aria-labelledby=ejemplo]");
	await example.scrollIntoViewIfNeeded();
	await expect(example.locator("astro-island").first()).not.toHaveAttribute("ssr", /.*/);
	await hydrated(page);
	// El de la página (Base) y el del ejemplo están montados a la vez
	await expect(page.locator("[data-copy-tooltip]")).toHaveCount(2);
	const button = example.getByRole("button", { name: "Copiar instalación" });
	await copyFrom(button);
	await expect(page.locator("[data-copy-tooltip]:not(:empty)")).toHaveCount(1);
	await expect(page.locator("[data-copy-tooltip]:not(:empty)")).toHaveText("Copiado");
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("bun add @jotis-me/react");
});

test("copiar falla: un aviso de error dice qué ha pasado y cómo seguir, y no se cierra solo", async ({
	page,
}) => {
	// El navegador no deja usar el portapapeles
	await page.addInitScript(() => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText: () => Promise.reject(new Error("denegado")) },
		});
	});
	await page.goto("/start/install/");
	await hydrated(page);
	await page.getByRole("button", { name: "Copiar" }).first().click();
	const alert = page.getByRole("alert");
	await expect(alert).toContainText("No se ha podido copiar");
	await expect(alert).toContainText("Selecciona el texto y cópialo a mano.");
	// Sin la burbuja de siempre, y sigue ahí pasado el tiempo en que una burbuja se habría ido
	await expect(tooltip(page)).toHaveText("");
	await page.waitForTimeout(7000);
	await expect(alert).toBeVisible();
	// Se va cuando se cierra
	await alert.getByRole("button").click();
	await expect(alert).toHaveCount(0);
});
