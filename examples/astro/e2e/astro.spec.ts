import { expect, type Page, test } from "@playwright/test";

function watch(page: Page) {
	const scripts: string[] = [];
	const problems: string[] = [];
	page.on("request", (r) => {
		if (r.resourceType() === "script") scripts.push(r.url());
	});
	page.on("console", (m) => {
		if (m.type() === "error" || m.type() === "warning") problems.push(m.text());
	});
	page.on("pageerror", (e) => problems.push(e.message));
	return { scripts, problems };
}

test("componentes sin directiva: HTML con su aspecto final y ni un script", async ({ page }) => {
	const { scripts, problems } = watch(page);
	await page.goto("/");
	const save = page.getByRole("button", { name: "Nuevo gasto" });
	expect(await save.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe("rgb(79, 57, 246)");
	await expect(page.getByRole("button", { name: "Cerrar" })).toBeVisible();
	await expect(page.getByRole("img", { name: "Correcto" })).toBeVisible();
	expect(scripts).toEqual([]);
	expect(problems).toEqual([]);
});

test("icono SVG suelto sin React: toma el color del contenedor", async ({ page }) => {
	await page.goto("/");
	const svg = page.locator("#svg-suelto svg");
	await expect(svg).toHaveAttribute("stroke", "currentColor");
	expect(await svg.evaluate((e) => getComputedStyle(e).stroke)).toBe("rgb(82, 82, 82)");
});

test("isla con client:load: responde a ratón y teclado", async ({ page }) => {
	const { problems } = watch(page);
	await page.goto("/interactivo/");
	const group = page.getByRole("group", { name: "Vista" });
	await expect(group.getByRole("button", { name: "Lista" })).toHaveAttribute("aria-pressed", "true");
	await group.getByRole("button", { name: "Tabla" }).click();
	await expect(group.getByRole("button", { name: "Tabla" })).toHaveAttribute("aria-pressed", "true");
	await page.keyboard.press("Shift+Tab");
	await page.keyboard.press("Space");
	await expect(group.getByRole("button", { name: "Lista" })).toHaveAttribute("aria-pressed", "true");
	expect(problems).toEqual([]);
});

test("envoltorio .tsx para pasar funciones a la isla", async ({ page }) => {
	await page.goto("/interactivo/");
	await page.getByRole("group", { name: "Periodo" }).getByRole("button", { name: "24 horas" }).click();
	await expect(page.getByTestId("elegido")).toHaveText("Elegido: d");
});

test("sin directiva el interactivo pinta su HTML inicial pero no responde", async ({ page }) => {
	await page.goto("/interactivo/");
	const group = page.getByRole("group", { name: "Sin directiva" });
	await expect(group.getByRole("button", { name: "X" })).toHaveAttribute("aria-pressed", "true");
	await group.getByRole("button", { name: "Y" }).click();
	await expect(group.getByRole("button", { name: "Y" })).toHaveAttribute("aria-pressed", "false");
});
