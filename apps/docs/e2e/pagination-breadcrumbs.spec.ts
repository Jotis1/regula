// Pagination y Breadcrumbs en Chromium real: en móvil los botones quedan solo con el icono y los números pasan a
// «Página N de T»; el desplegable de cuenta de las migas cambia de cuenta con el teclado.
import { expect, test } from "@playwright/test";

const hydrated = async (page: import("@playwright/test").Page, nav: string) => {
	await page.waitForFunction((name) => {
		const el = document.querySelector(`nav[aria-label="${name}"] button`);
		return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
	}, nav);
};

test.describe("móvil", () => {
	test.use({ viewport: { width: 375, height: 800 } });

	test("card-minimal: botones solo con icono y texto «Página 1 de 10»", async ({ page }) => {
		await page.goto("/visual/pagination/");
		await hydrated(page, "Tarjeta mínima derecha");
		const nav = page.getByRole("navigation", { name: "Tarjeta mínima derecha" });
		const next = nav.getByRole("button", { name: "Siguiente" });
		const box = await next.boundingBox();
		expect(box?.width).toBeLessThan(48);
		await expect(nav.getByText("Página 1 de 10")).toBeVisible();
		await expect(nav.getByRole("button", { name: /Filas por página/ })).toBeHidden();
	});

	test("page-default: los números se sustituyen por el texto de página", async ({ page }) => {
		await page.goto("/visual/pagination/");
		await hydrated(page, "Página, texto");
		const nav = page.getByRole("navigation", { name: "Página, texto" });
		await expect(nav.getByRole("button", { name: "Página 3" })).toBeHidden();
		await expect(nav.getByText("Página 1 de 10")).toBeVisible();
		await nav.getByRole("button", { name: "Siguiente" }).click();
		await expect(nav.getByText("Página 2 de 10")).toBeVisible();
	});
});

test.describe("escritorio", () => {
	test.use({ viewport: { width: 800, height: 900 } });

	test("card-advanced: el cuadro de página va a la página escrita con Enter", async ({ page }) => {
		await page.goto("/visual/pagination/");
		await hydrated(page, "Avanzada");
		const nav = page.getByRole("navigation", { name: "Avanzada", exact: true });
		const input = nav.getByRole("textbox", { name: "Ir a la página" });
		await input.fill("7");
		await page.keyboard.press("Enter");
		await expect(nav.getByRole("button", { name: "Página 7" })).toHaveAttribute("aria-current", "page");
		await expect(input).toHaveValue("7");
	});

	test("migas de cuenta: el desplegable cambia de cuenta con el teclado", async ({ page }) => {
		await page.goto("/visual/breadcrumbs/");
		await hydrated(page, "Migas con cuenta");
		const nav = page.getByRole("navigation", { name: "Migas con cuenta" });
		const trigger = nav.getByRole("button");
		await expect(trigger).toContainText("Caitlyn King");
		await trigger.focus();
		await page.keyboard.press("Enter");
		await page.getByText("Sienna Hewitt").last().click();
		await expect(trigger).toContainText("Sienna Hewitt");
	});
});
