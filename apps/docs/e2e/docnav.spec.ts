// Navegación lateral del rediseño (reference/docs-design/Main.dc.html), con el `SidebarNav` del paquete: el árbol de
// la sección actual, con sus grupos como <details> (design D2 de redesign-docs-site-v2).
import { expect, type Page, test } from "@playwright/test";
import { COMPONENT_GROUPS, FOUNDATIONS } from "../src/lib/catalog";

const groupsOf = (section: "components" | "stream") => COMPONENT_GROUPS.filter((g) => g.section === section);

const docnav = (page: Page) => page.getByRole("navigation", { name: "Documentación" });
const filterOf = (page: Page) => docnav(page).getByLabel("Filtrar navegación");
const group = (page: Page, label: string) =>
	docnav(page)
		.locator("details")
		.filter({ has: page.locator("summary", { hasText: label }) });
const link = (page: Page, name: string) => docnav(page).getByRole("link", { name, exact: true });

test.use({ viewport: { width: 1440, height: 900 } });

test("el filtro «tabla» deja Table con su grupo abierto", async ({ page }) => {
	await page.goto("/components/button/");
	await filterOf(page).fill("tabla");
	await expect(link(page, "Table")).toBeVisible();
	await expect(group(page, "Datos")).toHaveAttribute("open", "");
	// Lo que no coincide se oculta: Button, que estaba abierto, y el resto de grupos
	await expect(link(page, "Button")).toBeHidden();
	await expect(link(page, "Todos los componentes")).toBeHidden();
	await expect(group(page, "Acciones")).toBeHidden();
	// Al vaciarlo vuelve a como estaba: Acciones abierto (la página actual) y Datos cerrado
	await filterOf(page).fill("");
	await expect(group(page, "Acciones")).toHaveAttribute("open", "");
	await expect(group(page, "Datos")).not.toHaveAttribute("open", "");
	await expect(link(page, "Todos los componentes")).toBeVisible();
});

test("el filtro no distingue tildes, encuentra por palabras clave y avisa cuando no hay nada", async ({
	page,
}) => {
	await page.goto("/components/button/");
	await filterOf(page).fill("dialogo");
	await expect(link(page, "Modal")).toBeVisible();
	await filterOf(page).fill("zzzz");
	await expect(page.locator("aside [data-docnav-empty]")).toBeVisible();
	await page.goto("/start/install/");
	await filterOf(page).fill("tailwind");
	await expect(link(page, "Instalación")).toBeVisible();
	await expect(link(page, "Qué es Regula")).toBeHidden();
});

test("la tecla / lleva al filtro", async ({ page }) => {
	await page.goto("/foundations/color/");
	await page.locator("body").press("/");
	await expect(filterOf(page)).toBeFocused();
});

test("Componentes: «Todos los componentes» y los doce grupos con su recuento", async ({ page }) => {
	await page.goto("/components/button/");
	const groups = groupsOf("components");
	expect(groups).toHaveLength(12);
	await expect(link(page, "Todos los componentes")).toHaveAttribute("href", "/components/");
	await expect(docnav(page).locator("summary")).toHaveCount(groups.length);
	for (const g of groups)
		await expect(group(page, g.label).locator("summary")).toHaveText(
			new RegExp(`^\\s*${g.label}\\s*${g.components.length}$`),
		);
	// Acciones: Button, ButtonGroup, ButtonUtility, CloseButton, SocialButton, SocialButtonGroup y AppStoreBadge
	await expect(group(page, "Acciones").locator("summary")).toContainText("7");
	// Los componentes de Stream no salen aquí: tienen su sección
	await expect(group(page, "Escenas")).toHaveCount(0);
	await page.goto("/components/");
	await expect(link(page, "Todos los componentes")).toHaveAttribute("aria-current", "page");
});

test("Stream: la guía y sus cuatro grupos", async ({ page }) => {
	await page.goto("/foundations/stream/");
	const groups = groupsOf("stream");
	expect(groups).toHaveLength(4);
	await expect(link(page, "Guía de Stream")).toHaveAttribute("aria-current", "page");
	await expect(docnav(page).locator("summary")).toHaveCount(groups.length);
	await expect(group(page, "Acciones")).toHaveCount(0);
	await page.goto("/components/stream-scene/");
	await expect(group(page, "Escenas")).toHaveAttribute("open", "");
});

test("Fundamentos: sus páginas y nada de componentes; Empezar: instalación", async ({ page }) => {
	await page.goto("/foundations/color/");
	await expect(link(page, "Color")).toHaveAttribute("aria-current", "page");
	await expect(docnav(page).getByRole("link", { includeHidden: true })).toHaveCount(FOUNDATIONS.length);
	// En Color no salen los grupos de componentes
	await expect(docnav(page).locator("details")).toHaveCount(0);
	await expect(docnav(page).getByRole("link", { name: "Table", includeHidden: true })).toHaveCount(0);
	await page.goto("/start/install/");
	await expect(link(page, "Instalación")).toHaveAttribute("aria-current", "page");
	await expect(docnav(page).getByRole("link", { includeHidden: true })).toHaveText([
		"Qué es Regula",
		"Instalación",
	]);
});

test("la página actual lleva aria-current y su grupo está abierto", async ({ page }) => {
	await page.goto("/components/button/");
	await expect(link(page, "Button")).toHaveAttribute("aria-current", "page");
	await expect(group(page, "Acciones")).toHaveAttribute("open", "");
	await expect(group(page, "Formularios")).not.toHaveAttribute("open", "");
});

test("la navegación no repite ids", async ({ page }) => {
	await page.goto("/components/button/");
	const ids = await page.locator("[id]").evaluateAll((els) => els.map((e) => e.id));
	expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
});

test.describe("sin JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("el grupo actual sale abierto, se abre y se cierra otro, y el filtro no aparece", async ({
		page,
	}) => {
		await page.goto("/components/button/");
		await expect(filterOf(page)).toBeHidden();
		await expect(group(page, "Acciones")).toHaveAttribute("open", "");
		await expect(link(page, "Button")).toBeVisible();
		await expect(link(page, "Table")).toBeHidden();
		await group(page, "Datos").locator("summary").click();
		await expect(link(page, "Table")).toBeVisible();
		await group(page, "Datos").locator("summary").click();
		await expect(link(page, "Table")).toBeHidden();
		await group(page, "Datos").locator("summary").click();
		await link(page, "Table").click();
		await expect(page).toHaveURL(/\/components\/table\/$/);
		await expect(link(page, "Table")).toHaveAttribute("aria-current", "page");
		await expect(group(page, "Datos")).toHaveAttribute("open", "");
	});
});

test.describe("páginas sin lateral", () => {
	for (const [name, url] of [
		["la portada", "/"],
		["la galería de iconos", "/icons/"],
		["los iconos de banderas", "/icons/flags/"],
		["la 404", "/esto-no-existe/"],
	] as const)
		test(`${name} no lleva navegación lateral`, async ({ page }) => {
			await page.goto(url);
			// Las páginas de iconos tienen su propio `<aside>` (el icono elegido): se mira la navegación, no la etiqueta
			await expect(page.locator("[data-docnav]")).toHaveCount(0);
			await expect(docnav(page)).toHaveCount(0);
			await expect(page.locator("main#contenido")).toBeVisible();
		});
});
