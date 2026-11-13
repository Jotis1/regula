// Portada del rediseño (redesign-docs-site-v2, design D4; lienzo Home, HomeDark y HomeMobile): las cifras son las de
// los paquetes, las cinco reglas se cuentan como una historia y «Así se ve» enseña los dos temas a la vez.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { colors } from "@jotis-me/tokens";
import { expect, type Locator, type Page, test } from "@playwright/test";
import * as lineIcons from "@untitledui/icons";
import { STORY, thousands } from "../src/components/home/story";
import { COMPONENT_GROUPS, FOUNDATIONS } from "../src/lib/catalog";

const components = readdirSync(join(import.meta.dirname, "../src/content/components")).filter((f) =>
	f.endsWith(".md"),
).length;
// Cifras del catálogo, sin números escritos: crecen con cada componente
const iconCount = thousands(Object.keys(lineIcons).length);
const appGroups = COMPONENT_GROUPS.filter((g) => g.section === "components");
const streamGroups = COMPONENT_GROUPS.filter((g) => g.section === "stream");
const appComponents = appGroups.reduce((n, g) => n + g.components.length, 0);

const section = (page: Page, id: string) => page.locator(`section[aria-labelledby='${id}']`);
/** Espera a que la isla que contiene `inside` esté hidratada (Astro le quita `ssr`). */
async function hydrated(_page: Page, inside: Locator) {
	await inside.scrollIntoViewIfNeeded();
	// `inside` cuelga de la página, no de la isla: se mira su isla más cercana
	await expect
		.poll(() => inside.first().evaluate((el) => el.closest("astro-island")?.hasAttribute("ssr") ?? false))
		.toBe(false);
}
/** Suma de los tres canales de un `rgb(…)`: alta en un fondo claro, baja en uno oscuro. */
/** Fondo y color de texto de un elemento: cambia cuando cambia su jerarquía o su color. */
const paint = (locator: Locator) =>
	locator.evaluate((el) => {
		const s = getComputedStyle(el);
		return `${s.backgroundColor} ${s.color}`;
	});
const brightness = (locator: Locator) =>
	locator.evaluate((el) =>
		(getComputedStyle(el).backgroundColor.match(/\d+/g) ?? [])
			.slice(0, 3)
			.reduce((n, c) => n + Number(c), 0),
	);

test.describe("escritorio", () => {
	test.use({ viewport: { width: 1440, height: 900 } });

	test("cifras reales: componentes, iconos y tokens son los de los paquetes", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("[data-counts]")).toContainText(
			`${iconCount} iconos y ${components} componentes para Vinculum`,
		);
		const meta = page.locator("[data-map-meta]");
		await expect(meta).toHaveText([
			`${FOUNDATIONS.length} apartados y ${Object.keys(colors).length} tokens de color.`,
			`${appComponents} de aplicación en ${appGroups.length} grupos.`,
			`${components - appComponents} componentes en ${streamGroups.length} grupos.`,
			`${iconCount} iconos.`,
		]);
	});

	test("un solo titular, y la instalación es la única acción principal de la página", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"Las reglas de la suite, con el código al lado.",
		);
		await expect(page.getByRole("link", { name: "Seguir la instalación" })).toHaveAttribute(
			"href",
			"/start/install/",
		);
		await expect(page.locator("main h2")).toHaveText([
			"Llega así. En cinco pasos, deja de doler.",
			"Una pantalla, dos temas, cero capturas.",
			"Por dónde seguir",
			"La suite",
		]);
	});

	test("el campo de búsqueda abre la búsqueda global, con el ratón y con el teclado", async ({ page }) => {
		await page.goto("/");
		await expect(
			page.locator("astro-island:not([ssr])").filter({ hasText: "Buscar" }).first(),
		).toBeAttached();
		const field = page.locator("main").getByRole("textbox", { name: "Buscar en Regula" });
		await expect(field).toHaveAttribute("placeholder", "Busca lo que te falte");
		await expect(field).toHaveAttribute("readonly", "");
		const dialog = page.getByRole("dialog", { name: "Buscar en Regula" });
		await field.click();
		await expect(dialog).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden();
		await field.focus();
		await page.keyboard.press("Enter");
		await expect(dialog).toBeVisible();
	});

	test("el formulario son componentes de verdad: se escribe y se cambia la divisa", async ({ page }) => {
		await page.goto("/");
		const hero = section(page, "hero-t");
		const amount = hero.getByLabel("Importe");
		await hydrated(page, amount);
		await expect(hero.getByRole("region", { name: "pecunia.jotis.me/gastos/nuevo" })).toBeVisible();
		await amount.fill("12,00");
		await expect(amount).toHaveValue("12,00");
		await expect(hero.getByText("Ese correo no parece un correo. Revísalo.")).toBeVisible();
		const currency = hero.getByRole("button", { name: /Divisa/ });
		await expect(currency).toContainText("EUR");
		await currency.click();
		await page.getByRole("option", { name: "USD" }).click();
		await expect(currency).toContainText("USD");
	});

	test("la instalación sale del README, con los comandos de Next.js y de Astro", async ({ page }) => {
		await page.goto("/");
		const install = page.locator("[data-install]");
		await expect(install).toContainText("bun add @jotis-me/react tailwindcss @tailwindcss/postcss");
		await expect(install).not.toContainText("@jotis/regula");
		await hydrated(page, install.getByRole("tab", { name: "Astro" }));
		await install.getByRole("tab", { name: "Astro" }).click();
		await expect(install).toContainText("bunx astro add react");
		await expect(install).toContainText("bun add @jotis-me/react tailwindcss @tailwindcss/vite");
	});

	test("historia de las reglas: dos veces «Siguiente regla» deja dos reglas puestas y señala la segunda", async ({
		page,
	}) => {
		await page.goto("/");
		const story = section(page, "reglas-t").locator("[data-story='steps']");
		const next = story.getByRole("button", { name: "Siguiente regla" });
		await hydrated(page, next);
		const steps = story.getByRole("list", { name: "La pantalla, regla a regla" }).locator("> li");
		await expect(steps).toHaveCount(STORY.length);
		await expect(steps.nth(0)).toHaveAttribute("aria-current", "step");
		// Tal como llega: tres botones primarios, etiquetas de colores y nada señalado
		const screen = story.locator("[data-story-screen]");
		await expect(screen).toHaveAttribute("data-story-screen", "0");
		await expect(story.locator("[data-spotlight-ring]")).toHaveCount(0);
		await expect(story.getByRole("button", { name: "Anterior" })).toBeDisabled();
		const cancelBefore = await paint(screen.getByRole("button", { name: "Cancelar" }));
		const tagBefore = await paint(screen.getByText("Casa", { exact: true }));

		await next.click();
		await next.click();

		// La segunda regla es el paso actual y su texto está a la vista
		await expect(steps.nth(2)).toHaveAttribute("aria-current", "step");
		await expect(story.locator("[aria-current='step']")).toHaveCount(1);
		await expect(steps.nth(2)).toContainText(STORY[2]?.text ?? "");
		await expect(steps.nth(2)).toContainText("De tres botones primarios queda uno: guardar.");
		// Las dos reglas aplicadas: las etiquetas ya no son de colores (regla 1) y «Cancelar» deja de ser primario (regla 2)
		await expect(screen).toHaveAttribute("data-story-screen", "2");
		// Con `poll`: el color cambia con una transición de 100 ms
		await expect.poll(() => paint(screen.getByText("Casa", { exact: true }))).not.toBe(tagBefore);
		await expect
			.poll(() => paint(screen.getByRole("button", { name: "Cancelar" })))
			.not.toBe(cancelBefore);
		// Las que no se han aplicado siguen sin aplicar: el importe sin formato y los campos sin etiqueta visible
		await expect(screen).toContainText("1284.5 EUR");
		await expect(screen.getByText("Concepto", { exact: true })).toHaveCount(0);
		// Lo que cambió con la segunda, y solo eso, está señalado
		await expect(story.locator("[data-spotlight-ring]")).toHaveCount(1);
		await expect(screen.locator("[data-zone='acciones'] [data-spotlight-ring]")).toBeVisible();
		await expect(story.locator("figcaption")).toHaveText(
			"Regla 2 de 5 aplicada. El marco índigo señala lo que acaba de cambiar.",
		);
	});

	test("historia de las reglas: los pasos, los puntos y «Anterior» también la mueven", async ({ page }) => {
		await page.goto("/");
		const story = section(page, "reglas-t").locator("[data-story='steps']");
		await hydrated(page, story.getByRole("button", { name: "Siguiente regla" }));
		const screen = story.locator("[data-story-screen]");
		await story.getByRole("button", { name: "Cifras con formato español" }).click();
		await expect(screen).toHaveAttribute("data-story-screen", "5");
		await expect(screen).toContainText("1.284,50 €");
		await expect(screen).toContainText("29 oct 2026");
		await expect(screen.getByText("Pagado")).toBeVisible();
		await expect(story.getByRole("button", { name: "Volver a empezar" })).toBeVisible();
		await story.getByRole("button", { name: "Anterior" }).click();
		await expect(screen).toHaveAttribute("data-story-screen", "4");
		await story.getByRole("button", { name: "Ir al paso 2 de 6" }).click();
		await expect(screen).toHaveAttribute("data-story-screen", "1");
		await expect(screen.locator("[data-zone='etiquetas'] [data-spotlight-ring]")).toBeVisible();
	});

	test("claro y oscuro a la vez: con la web en oscuro, la línea al 30 % deja el 30 % izquierdo en claro", async ({
		page,
	}) => {
		await page.addInitScript(() => localStorage.setItem("regula-tema", "oscuro"));
		await page.goto("/");
		await expect(page.locator("html")).toHaveClass(/dark-mode/);
		const view = section(page, "asi-t");
		const line = view.getByRole("slider", { name: "Mover la línea entre claro y oscuro" });
		await hydrated(page, line);
		await expect(line).toBeEnabled();
		await expect(line).toHaveValue("55");

		// Con el teclado: dos saltos de 10 y cinco pasos de 1 hacia la izquierda
		await line.focus();
		await page.keyboard.press("PageDown");
		await page.keyboard.press("PageDown");
		for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowLeft");
		await expect(line).toHaveValue("30");

		const light = view.locator("[data-theme-layer='light']");
		const dark = view.locator("[data-theme-layer='dark']");
		// La capa clara sigue en claro aunque la web esté en oscuro, y la oscura, en oscuro
		expect(await brightness(light)).toBeGreaterThan(600);
		expect(await brightness(dark)).toBeLessThan(150);
		// La oscura va encima y se recorta por la izquierda en la línea: a su izquierda se ve la clara
		const geometry = await dark.evaluate((el) => {
			const clipped = el.parentElement as HTMLElement;
			return getComputedStyle(clipped).clipPath;
		});
		expect(geometry).toMatch(/^inset\(0(px)? 0(px)? 0(px)? 30%\)$/);
		// La misma pantalla en las dos capas
		for (const layer of [light, dark]) {
			await expect(layer.locator("table tbody tr")).toHaveCount(4);
			await expect(layer).toContainText("1.284,50 €");
		}

		await view.getByRole("button", { name: "Todo oscuro" }).click();
		await expect(line).toHaveValue("0");
		await view.getByRole("button", { name: "Todo claro" }).click();
		await expect(line).toHaveValue("100");
	});

	test("el mapa lleva a las cuatro secciones y la suite enseña las seis apps con su icono", async ({
		page,
	}) => {
		await page.goto("/");
		const cards = section(page, "mapa-t").getByRole("link");
		await expect(cards).toHaveCount(4);
		for (const [i, href] of [
			"/foundations/principles/",
			"/components/",
			"/foundations/stream/",
			"/icons/",
		].entries())
			await expect(cards.nth(i)).toHaveAttribute("href", href);
		// Las muestras son perezosas: ninguna imagen del mapa se pide al cargar
		for (const img of await section(page, "mapa-t").locator("img").all())
			await expect(img).toHaveAttribute("loading", "lazy");
		const apps = section(page, "suite-t").locator("li");
		await expect(apps).toHaveText([/Ornatus/, /Vinculum/, /Pecunia/, /Emptor/, /Regula/, /Scaena/]);
		await expect(apps.nth(4).locator("svg:visible path").first()).toHaveAttribute("fill", "#4b004f");
	});
});

test.describe("móvil", () => {
	test.use({ viewport: { width: 390, height: 844 } });

	async function strip(page: Page) {
		await page.goto("/");
		const reglas = section(page, "reglas-t");
		// Por debajo de `lg` no se pintan los pasos de escritorio
		await expect(reglas.locator("[data-story='steps']")).toBeHidden();
		const list = reglas.getByRole("list", { name: "La pantalla, regla a regla" });
		await expect(list).toBeVisible();
		await list.scrollIntoViewIfNeeded();
		const frames = list.locator("> li");
		await expect(frames).toHaveCount(STORY.length);
		// Un fotograma por paso, con su pantalla y su texto
		for (const [i, step] of STORY.entries()) {
			await expect(frames.nth(i).locator(`[data-story-screen='${i}']`)).toHaveCount(1);
			await expect(frames.nth(i).getByRole("heading", { level: 3 })).toHaveText(step.title);
		}
		// Es una tira: más ancha que su caja, con desplazamiento horizontal y parada en cada fotograma
		const scroll = await list.evaluate((el) => {
			const s = getComputedStyle(el);
			return {
				overflows: el.scrollWidth > el.clientWidth,
				overflowX: s.overflowX,
				snap: s.scrollSnapType,
			};
		});
		expect(scroll.overflows).toBe(true);
		expect(scroll.overflowX).toBe("auto");
		expect(scroll.snap).toContain("x");
		// Y se desliza: al desplazarla, el último fotograma entra en pantalla
		await expect(frames.last()).not.toBeInViewport();
		await list.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: "instant" }));
		await expect(frames.last()).toBeInViewport();
		await expect(frames.last()).toContainText("1.284,50 €");
		// La página no se desplaza de lado
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
			true,
		);
		return { list, frames };
	}

	test("reglas en móvil: una tira deslizable con un fotograma por paso", async ({ page }) => {
		const { list } = await strip(page);
		// Hidratada, los puntos siguen a la tira
		await hydrated(page, list);
		await list.evaluate((el) => el.scrollTo({ left: 0, behavior: "instant" }));
		await expect(section(page, "reglas-t").getByText("1 de 6", { exact: true })).toBeAttached();
		await list.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: "instant" }));
		await expect(section(page, "reglas-t").getByText("6 de 6", { exact: true })).toBeAttached();
	});

	test.describe("sin JavaScript", () => {
		test.use({ javaScriptEnabled: false });

		test("reglas en móvil: la tira se ve y se desliza igual", async ({ page }) => {
			await strip(page);
		});

		test("«Así se ve» enseña los dos temas en su posición inicial, con el mando desactivado", async ({
			page,
		}) => {
			await page.goto("/");
			const view = section(page, "asi-t");
			await expect(view.getByRole("slider")).toBeDisabled();
			expect(await brightness(view.locator("[data-theme-layer='light']"))).toBeGreaterThan(600);
			expect(await brightness(view.locator("[data-theme-layer='dark']"))).toBeLessThan(150);
		});
	});

	test("en móvil el formulario también se ve y la acción principal ocupa el ancho", async ({ page }) => {
		await page.goto("/");
		await expect(section(page, "hero-t").getByLabel("Importe")).toBeVisible();
		const cta = await page.getByRole("link", { name: "Seguir la instalación" }).boundingBox();
		expect(cta?.width).toBeGreaterThan(300);
		// El mapa va sin muestras y la pantalla de «Así se ve», sin tabla
		await expect(section(page, "mapa-t").locator("img:visible")).toHaveCount(0);
		await expect(section(page, "asi-t").locator("table:visible")).toHaveCount(0);
	});
});
