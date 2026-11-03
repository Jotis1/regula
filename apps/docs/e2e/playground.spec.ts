// Playground genérico de la página de componente (design §4): los controles cambian el ejemplo y su código, y
// cada playground aguanta el primer y el último valor de cada control sin errores.
import { expect, type Locator, type Page, test } from "@playwright/test";
import { slugOf } from "../src/lib/catalog";
import { STARTS } from "../src/lib/playground";

test("Button: elegir secondary en hierarchy cambia el botón y el código", async ({ page }) => {
	await page.goto("/components/button/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await expect(pg.locator("astro-island")).not.toHaveAttribute("ssr", /.*/);
	const preview = pg.locator("[data-playground-preview]");
	const button = preview.getByRole("button", { name: "Nuevo gasto" });
	const before = await button.evaluate((b) => getComputedStyle(b).backgroundColor);
	await pg
		.getByRole("group", { name: "hierarchy" })
		.getByRole("button", { name: "secondary", exact: true })
		.click();
	await expect(pg.getByRole("tabpanel")).toContainText(
		'<Button hierarchy="secondary">Nuevo gasto</Button>',
	);
	// El fondo cambia con una transición
	await expect.poll(() => button.evaluate((b) => getComputedStyle(b).backgroundColor)).not.toBe(before);
	await flip(page, pg.getByRole("switch", { name: "loading" }));
	await expect(pg.getByRole("tabpanel")).toContainText('<Button hierarchy="secondary" loading>');
	await expect(preview.getByRole("button", { name: "Nuevo gasto" })).toHaveAttribute("aria-busy", "true");
});

test("el código copiado del playground es el que se ve e importa de @jotis-me/react", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/components/badge/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await expect(pg.locator("astro-island")).not.toHaveAttribute("ssr", /.*/);
	await pg
		.getByRole("group", { name: "type" })
		.getByRole("button", { name: "modern", exact: true })
		.click();
	await pg.getByRole("button", { name: /copiar/i }).click();
	// El portapapeles de Windows devuelve los saltos como \r\n
	const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n");
	expect(copied).toBe('import { Badge } from "@jotis-me/react";\n\n<Badge type="modern">Pagado</Badge>');
});

test("en móvil cada selector es un desplegable, como ButtonM, y cambia el código", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/components/button/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await expect(pg.locator("astro-island")).not.toHaveAttribute("ssr", /.*/);
	await expect(pg.getByRole("group", { name: "hierarchy" })).toBeHidden();
	await pg.getByRole("combobox", { name: "hierarchy" }).selectOption("link-gray");
	await expect(pg.getByRole("tabpanel")).toContainText(
		'<Button hierarchy="link-gray">Nuevo gasto</Button>',
	);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("un componente sin playground enseña solo sus ejemplos", async ({ page }) => {
	await page.goto("/components/breadcrumbs/");
	await expect(page.locator("section[aria-labelledby=ejemplo]")).toHaveCount(0);
	await expect(page.locator("#variantes")).toBeVisible();
});

/** Elige en cada control su primer o su último valor. */
async function extremes(page: Page, which: "first" | "last") {
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	for (const group of await pg
		.locator("[data-pg-control=choice] fieldset")
		.filter({ visible: true })
		.all()) {
		const options = group.getByRole("button");
		await (which === "first" ? options.first() : options.last()).click();
	}
	for (const select of await pg
		.locator("[data-pg-control=choice] select")
		.filter({ visible: true })
		.all()) {
		const values = await select
			.locator("option")
			.evaluateAll((os) => os.map((o) => (o as HTMLOptionElement).value));
		await select.selectOption(which === "first" ? (values[0] as string) : (values.at(-1) as string));
	}
	for (const toggle of await pg.getByRole("switch").all())
		if ((await toggle.isChecked()) !== (which === "last")) await flip(page, toggle);
}

/** Pulsa un Toggle: el input va oculto bajo su dibujo, así que se pulsa la etiqueta que lo envuelve. */
const flip = (_page: Page, toggle: Locator) => toggle.locator("xpath=ancestor::label[1]").click();

// Uno por componente con playground (los de STARTS), para que corran en paralelo
for (const name of Object.keys(STARTS))
	test(`humo: ${name} se monta con el primer y el último valor de cada control sin errores`, async ({
		page,
	}) => {
		const errors: string[] = [];
		page.on("pageerror", (e) => errors.push(e.message));
		page.on("console", (m) => {
			if (m.type() === "error") errors.push(m.text());
		});
		await page.goto(`/components/${slugOf(name)}/`);
		const pg = page.locator("section[aria-labelledby=ejemplo]");
		await expect(pg.locator("astro-island").first()).not.toHaveAttribute("ssr", /.*/);
		for (const which of ["first", "last"] as const) {
			await extremes(page, which);
			await expect(pg.locator("[data-playground-preview] > div:last-child > *").first()).toBeAttached();
		}
		expect(errors).toEqual([]);
	});
