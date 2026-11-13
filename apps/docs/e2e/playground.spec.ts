// Ejemplo interactivo de la página de componente (design D3 de redesign-docs-site-v2): tres zonas (cabecera con los
// atajos, lienzo y código a la izquierda, inspector a la derecha), grupos plegables, filtro, cambios a la vista y, en
// móvil, una columna con el lienzo pegado arriba y una barra abajo. Y cada ejemplo aguanta el primer y el último valor
// de cada control sin errores.
import { expect, type Locator, type Page, test } from "@playwright/test";
import { slugOf } from "../src/lib/catalog";
import { STARTS } from "../src/lib/playground";

/** La sección del ejemplo, con su isla ya hidratada. */
async function example(page: Page, path: string): Promise<Locator> {
	await page.goto(path);
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await pg.scrollIntoViewIfNeeded();
	await expect(pg.locator("astro-island").first()).not.toHaveAttribute("ssr", /.*/);
	await expect(pg.locator("[data-playground]")).toBeVisible();
	return pg;
}

/** El control de una prop (`data-prop`), con su grupo abierto y a la vista. */
async function control(pg: Locator, prop: string): Promise<Locator> {
	const el = pg.locator(`[data-playground-controls] [data-prop="${prop}"]`);
	const group = el.locator("xpath=ancestor::details[1]");
	if (!(await group.evaluate((d) => (d as HTMLDetailsElement).open)))
		await group.locator("> summary").click();
	await still(el);
	return el;
}

/**
 * Deja un elemento a la vista sin animación. La página se desplaza con suavidad y React Aria cierra una lista abierta
 * si algo se desplaza: pulsar un desplegable mientras la página aún se mueve lo abriría y lo cerraría.
 */
const still = (el: Locator) =>
	el.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));

/** Abre el desplegable de un control (el `Select` del paquete) y elige una opción por su nombre. */
async function choose(pg: Locator, prop: string, value: string) {
	const el = await control(pg, prop);
	// El botón del campo (o el chevron del que tiene búsqueda), no el «Restablecer» de su etiqueta
	await el.locator('button:not([aria-label^="Restablecer"])').click();
	await pg.page().getByRole("listbox").last().getByRole("option", { name: value, exact: true }).click();
}

/** Elige un atajo en el desplegable de la cabecera. */
async function shortcut(pg: Locator, label: string) {
	const trigger = pg.locator("[data-playground-shortcuts]").getByRole("button", { name: "Atajos" });
	await still(trigger);
	await trigger.click();
	await pg.page().getByRole("listbox").last().getByRole("option", { name: label, exact: true }).click();
}

/** Pulsa un Toggle: el input va oculto bajo su dibujo, así que se pulsa la etiqueta que lo envuelve. */
const flip = (toggle: Locator) => toggle.locator("xpath=ancestor::label[1]").click();

/** El interruptor de una prop, con su grupo abierto. */
const toggleOf = async (pg: Locator, prop: string) => (await control(pg, prop)).getByRole("switch");

/** Abre todos los grupos del inspector. */
async function openAll(pg: Locator) {
	for (const group of await pg.locator("[data-playground-controls] details").all())
		if (!(await group.evaluate((d) => (d as HTMLDetailsElement).open)))
			await group.locator("> summary").click();
}

/** Elige en cada control su primer o su último valor. */
async function extremes(page: Page, which: "first" | "last") {
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await openAll(pg);
	const triggers = pg
		.locator("[data-pg-control=choice] button[aria-haspopup=listbox]:not([disabled])")
		.filter({ visible: true });
	for (let i = 0; i < (await triggers.count()); i++) {
		await still(triggers.nth(i));
		await triggers.nth(i).click();
		const options = page.getByRole("listbox").last().getByRole("option");
		await (which === "first" ? options.first() : options.last()).click();
	}
	for (const toggle of await pg.locator("[data-playground-controls]").getByRole("switch").all())
		if ((await toggle.isEnabled()) && (await toggle.isChecked()) !== (which === "last")) {
			await still(toggle);
			await flip(toggle);
		}
}

const code = (pg: Locator) => pg.getByRole("tabpanel");
const changes = (pg: Locator) => pg.locator("[data-playground-changes]");
const count = (pg: Locator) => pg.locator("[data-playground-count]");

test("Button: elegir secondary en hierarchy cambia el botón y el código", async ({ page }) => {
	const pg = await example(page, "/components/button/");
	const preview = pg.locator("[data-playground-preview]");
	const button = preview.getByRole("button", { name: "Nuevo gasto" });
	const before = await button.evaluate((b) => getComputedStyle(b).backgroundColor);
	await choose(pg, "hierarchy", "secondary");
	await expect(code(pg)).toContainText('<Button hierarchy="secondary">Nuevo gasto</Button>');
	// El fondo cambia con una transición
	await expect.poll(() => button.evaluate((b) => getComputedStyle(b).backgroundColor)).not.toBe(before);
	await flip(await toggleOf(pg, "loading"));
	await expect(code(pg)).toContainText('<Button hierarchy="secondary" loading>');
	await expect(preview.getByRole("button", { name: "Nuevo gasto" })).toHaveAttribute("aria-busy", "true");
});

test("el código copiado del playground es el que se ve e importa de @jotis-me/react", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	const pg = await example(page, "/components/badge/");
	await choose(pg, "type", "modern");
	await pg.getByRole("button", { name: /copiar/i }).click();
	// El portapapeles de Windows devuelve los saltos como \r\n
	const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n");
	expect(copied).toBe('import { Badge } from "@jotis-me/react";\n\n<Badge type="modern">Pagado</Badge>');
});

test("tres zonas: la cabecera arriba, el lienzo y el código a la izquierda y el inspector, de 368 px, a la derecha", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	const pg = await example(page, "/components/button/");
	const box = async (selector: string) => {
		const b = await pg.locator(selector).boundingBox();
		if (!b) throw new Error(`No se ve ${selector}`);
		return b;
	};
	const header = await box("[data-playground-shortcuts]");
	const preview = await box("[data-playground-preview]");
	const strip = await box("[data-playground-changes]");
	const snippet = await box("[data-playground-code]");
	const inspector = await box("[data-playground-controls]");
	// La cabecera, encima de todo: el desplegable de atajos, el recuento y «Restablecer todo», desactivado sin cambios
	expect(header.y + header.height).toBeLessThanOrEqual(preview.y);
	await expect(count(pg)).toHaveText("Sin cambios");
	await expect(pg.getByRole("button", { name: "Restablecer todo" })).toBeDisabled();
	// A la izquierda, el lienzo (336 px de alto como poco), la tira de cambios y el código, en ese orden
	expect(preview.height).toBeGreaterThanOrEqual(336);
	expect(preview.y + preview.height).toBeLessThanOrEqual(strip.y + 1);
	expect(strip.y + strip.height).toBeLessThanOrEqual(snippet.y + 1);
	await expect(changes(pg)).toHaveText("Todo como viene de fábrica. Toca algo, que para eso está.");
	// A la derecha, el inspector: 368 px, pegado al lienzo y con su propio desplazamiento
	const column = await pg.locator("[data-playground-controls]").locator("xpath=..").boundingBox();
	expect(Math.round(column?.width ?? 0)).toBe(368);
	expect(inspector.x).toBeGreaterThanOrEqual(preview.x + preview.width);
	expect(Math.abs(inspector.y - preview.y)).toBeLessThanOrEqual(1);
	await expect(pg.locator("[data-playground-controls]")).toHaveCSS("overflow-y", "auto");
	await expect(pg.getByRole("group", { name: "Propiedades" })).toBeVisible();
	// Ningún grupo de botones: cada prop con valores cerrados es un desplegable
	await openAll(pg);
	await expect(
		pg.locator("[data-pg-control=choice] button[aria-haspopup=listbox]:not([disabled])"),
	).toHaveCount(await pg.locator("[data-pg-control=choice]").count());
	await expect(pg.locator("[data-pg-control=choice] [role=group]")).toHaveCount(0);
});

test("los grupos: el primero abierto y el resto plegado, cada uno con cuántas props lleva", async ({
	page,
}) => {
	const pg = await example(page, "/components/button/");
	const groups = pg.locator("[data-playground-controls] details");
	await expect(groups).toHaveCount(3);
	expect(await groups.evaluateAll((els) => els.map((d) => (d as HTMLDetailsElement).open))).toEqual([
		true,
		false,
		false,
	]);
	await expect(groups.locator("> summary")).toHaveText([
		/^Lo esencial.*3 props$/,
		/^Iconos.*4 props$/,
		/^Estado.*2 props$/,
	]);
	// Con doce controles o menos no hay filtro
	await expect(pg.getByRole("searchbox", { name: "Filtrar propiedades" })).toHaveCount(0);
	// Un componente sin grupos tiene uno solo, «Propiedades», abierto
	const kbd = await example(page, "/components/kbd/");
	await expect(kbd.locator("[data-playground-controls] details")).toHaveCount(1);
	await expect(kbd.locator("[data-playground-controls] details[open] > summary")).toContainText(
		"Propiedades",
	);
});

test("Ver lo cambiado: Input con `size` e `icon` cambiados lo dice en la fila, en el grupo, en la tira y en el código", async ({
	page,
}) => {
	const pg = await example(page, "/components/input/");
	await choose(pg, "size", "lg");
	await choose(pg, "icon", "Mail01");
	// Las dos filas lo dicen con texto y traen su «Restablecer»
	for (const prop of ["size", "icon"]) {
		const row = pg.locator(`[data-prop="${prop}"]`);
		await expect(row.getByText("Cambiado", { exact: true })).toBeVisible();
		await expect(row.getByRole("button", { name: `Restablecer ${prop}` })).toHaveText("Restablecer");
	}
	await expect(pg.locator('[data-prop="label"]').getByText("Cambiado")).toHaveCount(0);
	// Sus grupos dicen cuántas tienen cambiadas
	await expect(pg.locator('[data-pg-group="Lo esencial"]')).toContainText("1 cambiada");
	await expect(pg.locator('[data-pg-group="Iconos y añadidos"]')).toContainText("1 cambiada");
	await expect(pg.locator('[data-pg-group="Ayuda y validación"]')).not.toContainText("cambiada");
	// La tira tiene las dos, con su forma en código, y la cabecera las cuenta
	await expect(changes(pg).locator("[data-change]")).toHaveText(['size="lg"', "icon={Mail01}"]);
	await expect(count(pg)).toHaveText("2 cambios");
	await expect(pg.getByRole("button", { name: "Restablecer todo" })).toBeEnabled();
	// El código marca sus líneas (y solo esas): `CodeSnippet` anuncia cada bloque marcado
	await expect(code(pg)).toContainText('size="lg"');
	await expect(code(pg)).toContainText("icon={Mail01}");
	// Las dos props van en líneas seguidas: un solo bloque marcado
	await expect(code(pg).getByText("línea destacada")).toHaveCount(1);
	// Sin cambios no hay ninguna línea marcada
	await pg.getByRole("button", { name: "Restablecer todo" }).click();
	await expect(code(pg).getByText("línea destacada")).toHaveCount(0);
});

test("Restablecer: quitar la etiqueta de `size` la devuelve a su valor; «Restablecer» en la fila y «Restablecer todo», también", async ({
	page,
}) => {
	const pg = await example(page, "/components/input/");
	await choose(pg, "size", "lg");
	await choose(pg, "icon", "Mail01");
	await changes(pg).getByRole("button", { name: "Quitar el cambio de size" }).click();
	// `size` vuelve a `md`, su fila deja de decir «Cambiado» y el código deja de incluirla
	const size = pg.locator('[data-prop="size"]');
	await expect(size.locator("button[aria-haspopup=listbox]")).toContainText("md");
	await expect(size.getByText("Cambiado")).toHaveCount(0);
	await expect(code(pg)).not.toContainText("size=");
	await expect(changes(pg).locator("[data-change]")).toHaveText(["icon={Mail01}"]);
	await expect(count(pg)).toHaveText("1 cambio");
	// El foco no se pierde: se queda en la tira
	await expect(changes(pg)).toBeFocused();
	// Desde la fila: el foco pasa al control
	await pg.getByRole("button", { name: "Restablecer icon" }).click();
	await expect(code(pg)).not.toContainText("icon=");
	await expect(pg.locator('[data-prop="icon"] input')).toBeFocused();
	await expect(count(pg)).toHaveText("Sin cambios");
	// Y todo de una vez
	await choose(pg, "size", "sm");
	await flip(await toggleOf(pg, "required"));
	await expect(count(pg)).toHaveText("2 cambios");
	await pg.getByRole("button", { name: "Restablecer todo" }).click();
	await expect(count(pg)).toHaveText("Sin cambios");
	await expect(changes(pg)).toHaveText("Todo como viene de fábrica. Toca algo, que para eso está.");
	await expect(pg.getByRole("button", { name: "Restablecer todo" })).toBeDisabled();
});

test("Muchas props: Input pasa de doce controles y el filtro «label» deja solo los que lo llevan, con sus grupos abiertos", async ({
	page,
}) => {
	const pg = await example(page, "/components/input/");
	const controls = pg.locator("[data-playground-controls] [data-prop]");
	const total = await controls.count();
	expect(total).toBeGreaterThan(12);
	const filter = pg.getByRole("searchbox", { name: "Filtrar propiedades" });
	await expect(filter).toHaveAttribute("placeholder", `Filtrar las ${total} props`);
	// Con la batería entera la isla puede tardar en hidratar: si el filtro aún no responde, se vuelve a escribir
	await expect(async () => {
		await filter.fill("");
		await filter.fill("label");
		await expect.poll(() => controls.count(), { timeout: 1500 }).toBeLessThan(total);
	}).toPass();
	const props = await controls.evaluateAll((els) => els.map((el) => el.getAttribute("data-prop") ?? ""));
	expect(props.length).toBeGreaterThan(1);
	expect(props.length).toBeLessThan(total);
	for (const prop of props) expect(prop.toLowerCase()).toContain("label");
	expect(props).toContain("label");
	expect(props).toContain("labelAside");
	// Los grupos que quedan están abiertos y sus controles se ven
	const groups = pg.locator("[data-playground-controls] details");
	expect(await groups.evaluateAll((els) => els.every((d) => (d as HTMLDetailsElement).open))).toBe(true);
	for (const el of await controls.all()) await expect(el).toBeVisible();
	// Sin coincidencias, lo dice y deja una salida
	await filter.fill("zzz");
	await expect(pg.locator("[data-playground-empty]")).toContainText(
		"Ninguna prop lleva «zzz» en el nombre.",
	);
	await pg.getByRole("button", { name: "Limpiar filtro" }).click();
	await expect(controls).toHaveCount(total);
	// Al quitar el filtro, vuelve el primero abierto y el resto plegado
	expect(await groups.evaluateAll((els) => els.map((d) => (d as HTMLDetailsElement).open))).toEqual([
		true,
		...Array.from({ length: (await groups.count()) - 1 }, () => false),
	]);
});

test("Atajo de un tipo del Figma: Input → «Tarjeta de pago» pone `type` en `card` y el desplegable lo muestra elegido", async ({
	page,
}) => {
	const pg = await example(page, "/components/input/");
	const trigger = pg.locator("[data-playground-shortcuts]").getByRole("button", { name: "Atajos" });
	await expect(trigger).toContainText("Empezar desde un atajo");
	// Un cambio previo: el atajo parte de los valores por defecto, no de los actuales
	await choose(pg, "size", "lg");
	await shortcut(pg, "Tarjeta de pago");
	await expect(trigger).toContainText("Tarjeta de pago");
	await expect(pg.locator('[data-prop="type"] button[aria-haspopup=listbox]')).toContainText("card");
	await expect(pg.locator('[data-prop="size"] button[aria-haspopup=listbox]')).toContainText("md");
	await expect(pg.locator('[data-prop="label"] input')).toHaveValue("Tarjeta");
	await expect(code(pg)).toContainText('type="card"');
	await expect(pg.locator("[data-playground-preview] input")).toHaveAttribute(
		"placeholder",
		"1234 1234 1234 1234",
	);
	await expect(changes(pg).locator("[data-change]")).toHaveText([
		'type="card"',
		'label="Tarjeta"',
		'placeholder="1234 1234 1234 1234"',
	]);
	// Cambiar otra prop no lo quita; cambiar una de las suyas, sí
	await choose(pg, "size", "sm");
	await expect(trigger).toContainText("Tarjeta de pago");
	await choose(pg, "type", "email");
	await expect(trigger).toContainText("Empezar desde un atajo");
	// Los atajos van en un único desplegable: ninguna fila de botones
	await expect(pg.getByRole("group", { name: "Atajos" })).toHaveCount(0);
	await expect(pg.locator("[data-playground-presets]")).toHaveCount(0);
	await expect(pg.locator("[data-playground-shortcuts] button")).toHaveCount(1);
});

test("En móvil: a 390 px el lienzo sigue a la vista, los grupos van en una columna y «Copiar código» queda a mano", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.setViewportSize({ width: 390, height: 844 });
	const pg = await example(page, "/components/input/");
	const preview = pg.locator("[data-playground-preview]");
	const inspector = pg.locator("[data-playground-controls]");
	// Una columna: el lienzo, los atajos, la tira, los grupos y el código, en ese orden
	const tops = await Promise.all(
		[
			"[data-playground-preview]",
			"[data-playground-shortcuts]",
			"[data-playground-changes]",
			"[data-playground-controls]",
			"[data-playground-code]",
		].map(async (s) => (await pg.locator(s).boundingBox())?.y ?? -1),
	);
	expect(tops).toEqual([...tops].sort((a, b) => a - b));
	const wide = await inspector.boundingBox();
	expect(wide?.width).toBeGreaterThan(340);
	await expect(inspector).not.toHaveCSS("overflow-y", "auto");
	// La cabecera de escritorio no se pinta: el recuento y «Restablecer» van en la barra
	await expect(count(pg)).toBeHidden();
	await expect(pg.getByRole("button", { name: "Restablecer todo" })).toBeHidden();
	// Al recorrer los controles, el componente sigue a la vista, pegado arriba
	await choose(pg, "size", "lg");
	await openAll(pg);
	await still(pg.locator('[data-prop="pickerLabel"]'));
	await expect(preview).toBeInViewport();
	expect(Math.round((await preview.boundingBox())?.y ?? -1)).toBe(0);
	await expect(preview.getByRole("textbox")).toBeInViewport();
	// La barra, pegada abajo: el recuento, «Restablecer» y «Copiar código»
	const bar = pg.locator("[data-playground-bar]");
	await expect(bar).toBeInViewport();
	const barBox = await bar.boundingBox();
	// Pegada al borde inferior mientras el ejemplo sigue por debajo; si el ejemplo acaba antes, a su final
	expect(Math.round((barBox?.y ?? 0) + (barBox?.height ?? 0))).toBeLessThanOrEqual(844);
	await expect(bar).toContainText("1 cambio");
	await bar.getByRole("button", { name: "Copiar código" }).click();
	await expect(bar.getByRole("button", { name: "Copiado" })).toBeVisible();
	const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n");
	expect(copied).toContain('import { Input } from "@jotis-me/react";');
	expect(copied).toContain('size="lg"');
	await bar.getByRole("button", { name: "Restablecer", exact: true }).click();
	await expect(bar).toContainText("Sin cambios");
	await expect(bar.getByRole("button", { name: "Restablecer", exact: true })).toBeDisabled();
	// Nada se sale de la pantalla
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("en móvil la barra copia la versión que se ve: con la pestaña Astro, la de Astro", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.setViewportSize({ width: 390, height: 844 });
	const pg = await example(page, "/components/button/");
	await choose(pg, "hierarchy", "link-gray");
	await expect(code(pg)).toContainText('<Button hierarchy="link-gray">Nuevo gasto</Button>');
	await pg.getByRole("tab", { name: "Astro" }).click();
	await pg.locator("[data-playground-bar]").getByRole("button", { name: "Copiar código" }).click();
	const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n");
	expect(copied).toBe(
		'---\nimport { Button } from "@jotis-me/react";\n---\n\n<Button hierarchy="link-gray">Nuevo gasto</Button>',
	);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("las props: tabla desde `lg` y, por debajo, una lista plegable con el tipo bajo el nombre", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/components/input/");
	const section = page.locator("section[aria-labelledby=props]");
	await expect(section.getByRole("region", { name: "Props de Input" })).toBeVisible();
	await expect(section.locator("[data-props-list]")).toBeHidden();
	await page.setViewportSize({ width: 390, height: 844 });
	await expect(section.locator("[data-props-table]")).toBeHidden();
	const list = section.getByRole("list", { name: "Props de Input" });
	await expect(list).toBeVisible();
	// Una por prop, las mismas que la tabla
	const rows = await section.locator("[data-props-table] tbody tr").count();
	await expect(list.locator("> li")).toHaveCount(rows);
	const size = list.locator('> li[data-prop="size"]');
	await expect(size.locator("summary")).toContainText("size");
	await expect(size.locator("summary")).toContainText('"sm" · "md" · "lg"');
	// Plegada: la descripción y el valor por defecto van dentro
	await expect(size.getByText("Por defecto:")).toBeHidden();
	await size.locator("summary").click();
	await expect(size.getByText("Por defecto:")).toBeVisible();
	await expect(size.locator("details")).toContainText('"md"');
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

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
		const pg = await example(page, `/components/${slugOf(name)}/`);
		for (const which of ["first", "last"] as const) {
			await extremes(page, which);
			await expect(pg.locator("[data-playground-preview] > div:last-child > *").first()).toBeAttached();
		}
		expect(errors).toEqual([]);
	});

test("BackgroundPattern: el patrón llena su marco y cambia con los controles", async ({ page }) => {
	const pg = await example(page, "/components/background-pattern/");
	const preview = pg.locator("[data-playground-preview]");
	// Sin dibujo de fondo del playground: el único patrón es el del componente
	await expect(preview.locator("svg")).toHaveCount(1);
	const frame = await preview.locator("> div").first().boundingBox();
	expect(frame?.height).toBe(200);
	const before = await preview.locator("svg").innerHTML();
	await choose(pg, "pattern", "circles");
	await expect.poll(() => preview.locator("svg").innerHTML()).not.toBe(before);
	await expect(pg.locator("pre")).toContainText('pattern="circles"');
});

test("Button: elegir un icono lo pinta y lo escribe en el código; «Ninguno» lo quita", async ({ page }) => {
	const pg = await example(page, "/components/button/");
	await choose(pg, "iconLeading", "Plus");
	await expect(code(pg)).toContainText('import { Plus } from "@untitledui/icons";');
	await expect(code(pg)).toContainText("<Button iconLeading={Plus}>Nuevo gasto</Button>");
	await expect(pg.locator("[data-playground-preview] button svg")).toHaveCount(1);
	await choose(pg, "iconLeading", "Ninguno");
	await expect(code(pg)).toContainText("<Button>Nuevo gasto</Button>");
	await expect(pg.locator("[data-playground-preview] button svg")).toHaveCount(0);
});

test("Button: el texto entre las etiquetas se escribe en su campo", async ({ page }) => {
	const pg = await example(page, "/components/button/");
	const children = (await control(pg, "children")).getByRole("textbox");
	await expect(children).toHaveValue("Nuevo gasto");
	await children.fill("Guardar");
	await expect(
		pg.locator("[data-playground-preview]").getByRole("button", { name: "Guardar" }),
	).toBeVisible();
	await expect(code(pg)).toContainText("<Button>Guardar</Button>");
	await expect(changes(pg).locator("[data-change]")).toHaveText(["children: Guardar"]);
});

test("Skeleton: escribir un número en width cambia el ancho y el código", async ({ page }) => {
	const pg = await example(page, "/components/skeleton/");
	const width = pg.locator('[data-pg-control="number"]').filter({ hasText: "width" }).locator("input");
	await width.fill("220");
	await width.blur();
	await expect(code(pg)).toContainText("width={220}");
});

test("Prop incompatible: en Button, «iconOnly» desactiva los controles que no aplican, con su motivo en la pista", async ({
	page,
}) => {
	const pg = await example(page, "/components/button/");
	await choose(pg, "iconLeading", "ArrowRight");
	await choose(pg, "iconOnly", "Plus");
	const reason = "No aplica: un botón de solo icono no lleva texto ni iconos a los lados.";
	// Desactivados, con el motivo a la vista y enlazado al campo: es su descripción accesible
	for (const prop of ["iconLeading", "iconTrailing", "children"]) {
		const field = pg.locator(`[data-prop="${prop}"] input`);
		await expect(field).toBeDisabled();
		await expect(field).toHaveAccessibleDescription(reason);
		await expect(pg.locator(`[data-prop="${prop}"]`)).toContainText(reason);
	}
	// El botón no los recibe, el código no los incluye y no cuentan como cambiados
	await expect(code(pg)).toContainText('<Button iconOnly={Plus} label="Nuevo gasto" />');
	await expect(code(pg)).not.toContainText("iconLeading");
	await expect(changes(pg).locator("[data-change]")).toHaveText(["iconOnly={Plus}"]);
	await expect(pg.locator('[data-prop="iconLeading"]').getByText("Cambiado")).toHaveCount(0);
	// Volver a quitarlo reactiva todo, y el icono de delante vuelve con su valor anterior
	await choose(pg, "iconOnly", "Ninguno");
	await expect(pg.locator('[data-prop="iconLeading"] input')).toBeEnabled();
	await expect(code(pg)).toContainText("<Button iconLeading={ArrowRight}>Nuevo gasto</Button>");
});

test("Con teclado: Tab recorre los controles activos, los desactivados se anuncian con su motivo y el ejemplo cambia", async ({
	page,
}) => {
	const pg = await example(page, "/components/input/");
	const inspector = pg.locator("[data-playground-controls]");
	// Desde el filtro, Tab pasa por la cabecera del primer grupo y por cada control suyo, en orden
	await pg.getByRole("searchbox", { name: "Filtrar propiedades" }).focus();
	await page.keyboard.press("Tab");
	await expect(inspector.locator("details").first().locator("> summary")).toBeFocused();
	await page.keyboard.press("Tab");
	await expect(pg.locator('[data-prop="label"] input')).toBeFocused();
	await page.keyboard.press("Tab");
	await expect(pg.locator('[data-prop="type"] button')).toBeFocused();
	await page.keyboard.press("Tab");
	const size = pg.locator('[data-prop="size"] button[aria-haspopup=listbox]');
	await expect(size).toBeFocused();
	// El foco se ve
	expect(await size.evaluate((el) => el.matches(":focus-visible"))).toBe(true);
	// Cambiar uno con el teclado: se abre la lista, flecha abajo y Enter
	await page.keyboard.press("Enter");
	await expect(page.getByRole("listbox").last()).toBeVisible();
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect(size).toContainText("lg");
	await expect(code(pg)).toContainText('size="lg"');
	await expect(pg.locator("[data-playground-preview] input")).toBeVisible();
	// «Restablecer» de la fila también se alcanza y se pulsa con el teclado
	await page.keyboard.press("Shift+Tab");
	await expect(pg.getByRole("button", { name: "Restablecer size" })).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(code(pg)).not.toContainText("size=");
	await expect(size).toBeFocused();
	// Los que no aplican con `type="email"`: desactivados y con su motivo. El interruptor lo lleva en su nombre;
	// los campos, en su descripción (`aria-describedby`)
	const last = inspector.locator("details").last();
	await last.locator("> summary").focus();
	await page.keyboard.press("Enter");
	const revealable = last.getByRole("switch", { name: /revealable/ });
	await expect(revealable).toBeDisabled();
	await expect(revealable).toHaveAccessibleName(/No aplica: solo con type="password"\./);
	const chooseFile = pg.locator('[data-prop="chooseFileLabel"] input');
	await expect(chooseFile).toBeDisabled();
	await expect(chooseFile).toHaveAccessibleDescription('No aplica: solo con type="file".');
	// Tab no se para en ellos: del grupo sale al código
	await page.keyboard.press("Tab");
	expect(await last.evaluate((el) => el.contains(document.activeElement))).toBe(false);
	// Con el tipo que toca, vuelven a estar activos
	await choose(pg, "type", "password");
	await expect(revealable).toBeEnabled();
	await revealable.focus();
	await page.keyboard.press("Space");
	await expect(code(pg)).toContainText("revealable={false}");
});

test("los controles se alinean: el motivo de uno desactivado no mueve la etiqueta ni el campo de los de encima", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	const pg = await example(page, "/components/button/");
	await openAll(pg);
	// La etiqueta y el campo de cada control, respecto al inspector (que se desplaza por su cuenta)
	const places = () =>
		pg.locator("[data-playground-controls] [data-prop]").evaluateAll((els) => {
			const scroller = els[0]?.closest("[data-playground-controls]");
			const base = (scroller?.getBoundingClientRect().top ?? 0) - (scroller?.scrollTop ?? 0);
			return els.map((el) => {
				const label = el.querySelector("label");
				const field = el.querySelector("button[aria-haspopup], input");
				return {
					prop: el.getAttribute("data-prop"),
					labelLeft: Math.round(label?.getBoundingClientRect().left ?? 0),
					fieldLeft: Math.round(field?.getBoundingClientRect().left ?? 0),
					label: Math.round((label?.getBoundingClientRect().top ?? 0) - base),
					field: Math.round((field?.getBoundingClientRect().top ?? 0) - base),
				};
			});
		});
	const before = await places();
	expect(before.length).toBeGreaterThan(3);
	// Una columna: todas las etiquetas empiezan en el mismo borde
	expect(new Set(before.map((p) => p.labelLeft)).size).toBe(1);
	// Activar iconOnly desactiva `children` y los dos iconos de los lados, y a cada uno le sale su motivo debajo
	await choose(pg, "iconOnly", "Plus");
	await expect(pg.locator('[data-prop="iconLeading"]')).toContainText("No aplica");
	const after = await places();
	// El motivo va bajo su campo: ni su etiqueta ni su campo se mueven, y `children`, el primero, sigue donde estaba
	const at = (rows: typeof before, prop: string) => rows.find((r) => r.prop === prop);
	expect(at(after, "children")).toEqual(at(before, "children"));
	for (const prop of ["iconLeading", "iconTrailing"]) {
		const b = at(before, prop);
		const a = at(after, prop);
		expect((a?.field ?? 0) - (a?.label ?? 0), prop).toBe((b?.field ?? 0) - (b?.label ?? 0));
		expect(a?.labelLeft, prop).toBe(b?.labelLeft);
	}
});
