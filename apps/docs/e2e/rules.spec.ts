// Reglas con ejemplos (redesign-docs-site-v2, requisito «Reglas con ejemplos»): las páginas de componente y las de
// fundamentos enseñan sus reglas con pares de `ExampleCard` hechos con componentes de verdad, cada uno con su
// veredicto en texto y una frase.
import { expect, type Locator, test } from "@playwright/test";

/** El veredicto de una tarjeta: la palabra de su insignia. */
const card = (scope: Locator, verdict: string) =>
	scope.locator("figure").filter({ has: scope.page().locator("figcaption", { hasText: verdict }) });

/** Los botones de un espécimen con su texto y si son primarios (por su clase, que no cambia con el tema). */
const buttons = (figure: Locator) =>
	figure.locator("button").evaluateAll((els) =>
		els.map((b) => ({
			text: b.textContent?.trim(),
			primary: b.classList.contains("bg-brand-solid"),
		})),
	);

test("Una acción principal: en Button, «Cuándo usarlo» enseña un primario y un secundario «Esto sí» y dos primarios «Esto no»", async ({
	page,
}) => {
	await page.goto("/components/button/");
	const uso = page.locator("section[aria-labelledby=uso]");
	await expect(uso.getByRole("heading", { level: 2, name: "Cuándo usarlo" })).toBeVisible();
	await expect(uso.locator("figure")).toHaveCount(2);

	const yes = card(uso, "Esto sí");
	await expect(yes).toHaveCount(1);
	expect(await buttons(yes)).toEqual([
		{ text: "Cancelar", primary: false },
		{ text: "Guardar", primary: true },
	]);
	await expect(yes.locator("figcaption")).toContainText("Una sola primary por vista o por modal");

	const no = card(uso, "Esto no");
	await expect(no).toHaveCount(1);
	expect(await buttons(no)).toEqual([
		{ text: "Guardar", primary: true },
		{ text: "Exportar", primary: true },
	]);
	await expect(no.locator("figcaption")).toContainText("No apiles dos primarios.");

	// Son `Button` de verdad: 40 px de alto
	await expect(no.locator("button").first()).toHaveCSS("height", "40px");
	// Enseñan, no hacen: no entran en el orden de tabulación ni se pintan con una isla
	expect(
		await uso.locator("figure button").evaluateAll((els) => els.every((b) => !!b.closest("[inert]"))),
	).toBe(true);
	await expect(uso.locator("astro-island")).toHaveCount(0);
});

test("Button: «Evita» es su propia sección, con su par y lo que queda de la ficha, y está en «En esta página»", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/components/button/");
	const evita = page.locator("section[aria-labelledby=evita]");
	await expect(evita.getByRole("heading", { level: 2, name: "Evita" })).toBeVisible();
	await expect(card(evita, "Esto sí").locator("figcaption")).toContainText("Si borrar es una opción más");
	await expect(card(evita, "Esto no").locator("figcaption")).toContainText(
		"No todo lo negativo es un botón rojo.",
	);
	await expect(evita.locator("li")).toHaveText([
		"No cambies la forma: un botón tiene que parecer un botón.",
	]);
	// La frase que ya es pie de una tarjeta no se repite debajo
	await expect(page.getByText("No apiles dos primarios.")).toHaveCount(1);
	const toc = page.getByRole("navigation", { name: "En esta página" });
	await expect(toc.getByRole("link", { name: "Evita" })).toHaveAttribute("href", "#evita");
});

for (const [slug, component, yes, no] of [
	["input", "input", "Etiqueta siempre visible", "El placeholder es un ejemplo, nunca la etiqueta."],
	["badge", "span", "la palabra", "Nada de frases."],
	["modal", "[role=dialog]", "Solo un Button primario en actions", "son dos decisiones y van en dos pasos"],
	["empty-state", "h3", "Di por qué está vacío", "¡Ups!"],
] as const)
	test(`/components/${slug}/ enseña su regla con un par hecho con el componente`, async ({ page }) => {
		await page.goto(`/components/${slug}/`);
		const pair = page.locator("[data-example-pair]").first();
		await expect(pair.locator("figure")).toHaveCount(2);
		await expect(card(pair, "Esto sí").locator("figcaption")).toContainText(yes);
		await expect(card(pair, "Esto no").locator("figcaption")).toContainText(no);
		for (const figure of await pair.locator("figure").all())
			await expect(figure.locator(`[inert] ${component}`).first()).toBeVisible();
	});

test("un componente sin pares enseña su ficha como texto, sin tarjetas vacías", async ({ page }) => {
	await page.goto("/components/cam-frame/");
	const uso = page.locator("section[aria-labelledby=uso]");
	await expect(uso.getByRole("heading", { level: 2, name: "Cuándo usarlo" })).toBeVisible();
	await expect(uso.locator("figure")).toHaveCount(0);
	await expect(uso.locator("[data-card-section=evita]")).toContainText("Poner fondo al marco");
});

test("Contenido y tono: cada caso de «En lugar de esto, esto otro» es el mismo componente con el texto malo y con el bueno", async ({
	page,
}) => {
	await page.goto("/foundations/content/");
	const cases: [string, string, string, string][] = [
		["Estado vacío", "h3", "No se encontraron resultados.", "Aún no hay gastos"],
		[
			"Error leve",
			"input",
			"Se ha producido un error de validación.",
			"Ese correo no parece un correo. Revísalo.",
		],
		["Confirmación", "[role=status]", "Los cambios se han guardado correctamente.", "Guardado"],
		["Error", "input", "Error 422", "Introduce un correo válido."],
		["Botón", "button", "Aceptar", "Guardar"],
		["Mayúsculas", "button", "Nuevo Movimiento", "Nuevo movimiento"],
	];
	await expect(page.locator("[data-example-pair]")).toHaveCount(cases.length);
	for (const [title, selector, bad, good] of cases) {
		const pair = page.locator(`[data-example-pair="${title}"]`);
		await expect(pair.getByRole("heading", { level: 3, name: title, exact: true })).toBeVisible();
		const instead = card(pair, "En lugar de");
		const better = card(pair, "Mejor");
		await expect(instead).toHaveCount(1);
		await expect(better).toHaveCount(1);
		// El texto malo y el bueno están en el componente, no solo en el pie
		await expect(instead.locator("[inert]")).toContainText(bad);
		await expect(better.locator("[inert]")).toContainText(good);
		// Y es el mismo componente en los dos lados
		await expect(instead.locator(`[inert] ${selector}`).first()).toBeVisible();
		await expect(better.locator(`[inert] ${selector}`).first()).toBeVisible();
	}
	// Con el campo de verdad: el error va enlazado al campo
	const input = card(page.locator('[data-example-pair="Error"]'), "Mejor").locator("input");
	await expect(input).toHaveAttribute("aria-invalid", "true");
	await expect(page.getByRole("table", { name: /lo que se evita/ })).toHaveCount(0);
});

for (const slug of ["principles", "color", "typography", "layout", "states", "iconography", "backgrounds"])
	test(`/foundations/${slug}/ abre con pares «Esto sí, esto no»`, async ({ page }) => {
		await page.goto(`/foundations/${slug}/`);
		await expect(page.locator("article h2").first()).toHaveText("Con ejemplos");
		const pairs = page.locator("[data-example-pair]");
		expect(await pairs.count()).toBeGreaterThan(0);
		for (const pair of await pairs.all()) {
			await expect(card(pair, "Esto sí")).toHaveCount(1);
			await expect(card(pair, "Esto no")).toHaveCount(1);
			await expect(pair.locator("figcaption").first()).not.toBeEmpty();
		}
	});

test("los pares se apilan en móvil sin desplazamiento horizontal", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	for (const path of ["/components/button/", "/foundations/content/", "/foundations/backgrounds/"]) {
		await page.goto(path);
		const [a, b] = await page
			.locator("[data-example-pair]")
			.first()
			.locator("figure")
			.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().top));
		expect(b as number).toBeGreaterThan(a as number);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	}
});
