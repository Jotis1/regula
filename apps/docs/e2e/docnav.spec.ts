// Navegación lateral del rediseño (reference/docs-design/DocNav.dc.html), desde el catálogo (design §7).
import { expect, type Page, test } from "@playwright/test";

const docnav = (page: Page) => page.getByRole("navigation", { name: "Documentación" });
const group = (page: Page, label: string) =>
	docnav(page)
		.locator("details")
		.filter({ has: page.locator("summary", { hasText: label }) });

test.use({ viewport: { width: 1440, height: 900 } });

test("el filtro «tabla» deja Table con su grupo abierto", async ({ page }) => {
	await page.goto("/components/button/");
	const filter = docnav(page).getByLabel("Filtrar navegación");
	await filter.fill("tabla");
	await expect(docnav(page).getByRole("link", { name: "Table", exact: true })).toBeVisible();
	await expect(group(page, "Datos")).toHaveAttribute("open", "");
	// Lo que no coincide se oculta: Button, que estaba abierto, y las páginas de fundamentos
	await expect(docnav(page).getByRole("link", { name: "Button", exact: true })).toBeHidden();
	await expect(docnav(page).getByRole("link", { name: "Color", exact: true })).toBeHidden();
	await expect(group(page, "Acciones")).toBeHidden();
	// Al vaciarlo vuelve a como estaba: Acciones abierto (la página actual) y Datos cerrado
	await filter.fill("");
	await expect(group(page, "Acciones")).toHaveAttribute("open", "");
	await expect(group(page, "Datos")).not.toHaveAttribute("open", "");
});

test("el filtro no distingue tildes y avisa cuando no hay nada", async ({ page }) => {
	await page.goto("/");
	const filter = docnav(page).getByLabel("Filtrar navegación");
	await filter.fill("dialogo");
	await expect(docnav(page).getByRole("link", { name: "Modal", exact: true })).toBeVisible();
	await filter.fill("zzzz");
	await expect(docnav(page).getByText("Nada se llama así.")).toBeVisible();
});

test("la tecla / lleva al filtro", async ({ page }) => {
	await page.goto("/foundations/color/");
	await page.locator("body").press("/");
	await expect(docnav(page).getByLabel("Filtrar navegación")).toBeFocused();
});

test("la página actual lleva aria-current y su grupo está abierto", async ({ page }) => {
	await page.goto("/components/button/");
	await expect(docnav(page).getByRole("link", { name: "Button", exact: true })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await expect(group(page, "Acciones")).toHaveAttribute("open", "");
	await expect(group(page, "Formularios")).not.toHaveAttribute("open", "");
	await page.goto("/components/stream-scene/");
	await expect(group(page, "Escenas")).toHaveAttribute("open", "");
	await page.goto("/foundations/color/");
	await expect(docnav(page).getByRole("link", { name: "Color", exact: true })).toHaveAttribute(
		"aria-current",
		"page",
	);
});

test("tiene las secciones y los recuentos del catálogo", async ({ page }) => {
	await page.goto("/");
	await expect(docnav(page).getByRole("heading", { level: 2 })).toHaveText([
		"Empezar",
		"Fundamentos",
		"Iconos",
		/^Componentes\s*62$/,
		/^Stream\s*12$/,
	]);
	await expect(group(page, "Acciones").locator("summary")).toContainText("3");
	await expect(group(page, "Overlay").locator("summary")).toContainText("7");
});

test.describe("sin JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("se navega abriendo los grupos, y el filtro no aparece", async ({ page }) => {
		await page.goto("/components/button/");
		await expect(docnav(page).getByLabel("Filtrar navegación")).toBeHidden();
		await expect(group(page, "Acciones")).toHaveAttribute("open", "");
		await group(page, "Datos").locator("summary").click();
		await docnav(page).getByRole("link", { name: "Table", exact: true }).click();
		await expect(page).toHaveURL(/\/components\/table\/$/);
		await expect(docnav(page).getByRole("link", { name: "Table", exact: true })).toHaveAttribute(
			"aria-current",
			"page",
		);
	});
});
