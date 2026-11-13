import { loadRenderers } from "astro:container";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import ComponentPage from "../src/layouts/ComponentPage.astro";
import { splitCard } from "../src/lib/card";
import { propsOf } from "../src/lib/props";

const fixture = fileURLToPath(new URL("./fixtures/Ejemplo.tsx", import.meta.url));

const card = splitCard(
	[
		"**Cuándo usarlo.** Úsalo para probar la plantilla.",
		"**Evita.** Usarlo en producción.",
		"**Foco.** Anillo de 4 px.",
		"**Props.** Acepta además los atributos de `<button>`.",
	].join("\n\n"),
);

async function render(name: string, extra: Record<string, unknown> = {}) {
	// El layout lleva una isla React (la búsqueda de la cabecera)
	const renderers = await loadRenderers([getContainerRenderer()]);
	const container = await AstroContainer.create({ renderers });
	return container.renderToString(ComponentPage, {
		props: {
			name,
			description: "Componente de prueba de la plantilla.",
			card,
			props: propsOf(fixture, "Ejemplo"),
			next: '<Ejemplo label="Guardar" />',
			astro: '<Ejemplo client:load label="Guardar" />',
			...extra,
		},
		request: new Request(`https://regula.jotis.me/components/${name.toLowerCase()}/`),
	});
}

let html = "";
let button = "";
let real = "";
let badge = "";

/** La ficha de verdad de un componente: lo que va tras el frontmatter. */
function ficha(slug: string) {
	const text = readFileSync(
		fileURLToPath(new URL(`../src/content/components/${slug}.md`, import.meta.url)),
		"utf8",
	).replace(/\r\n/g, "\n");
	return splitCard(text.slice(text.indexOf("\n---", 4) + 4));
}

beforeAll(async () => {
	html = await render("Ejemplo", { interactive: true, astroNote: "Ponlo en una isla `client:load`." });
	// Un componente del catálogo: migas, grupo, anterior/siguiente y relacionados
	button = await render("Button", {
		descriptions: { ButtonGroup: "Varias opciones pegadas, con `items`." },
	});
	// Con su ficha de verdad: los pies de las tarjetas de ejemplo salen de ella
	real = await render("Button", { card: ficha("button") });
	badge = await render("Badge", { card: ficha("badge") });
});

const order = (page: string, ...needles: string[]) => needles.map((n) => page.indexOf(n));

describe("plantilla de página de componente", () => {
	it("pinta las secciones en el orden del diseño, con la ficha partida en dos", () => {
		expect(html).toContain("<h1");
		expect(html).toContain("Componente de prueba de la plantilla.");
		const at = order(
			html,
			">Cuándo usarlo</h2>",
			">Props</h2>",
			">Código</h2>",
			">Detalles y accesibilidad</h2>",
		);
		expect(at.every((i) => i > 0)).toBe(true);
		expect([...at].sort((a, b) => a - b)).toEqual(at);
		expect(html).toContain("Úsalo para probar la plantilla.");
		expect(html).toContain("Anillo de 4 px.");
		// Sin galería de variantes: el ejemplo interactivo es la primera sección y no hay «Variantes y estados»
		expect(html).not.toContain("Variantes y estados");
		expect(html).not.toContain('id="variantes"');
	});

	it("lleva la línea de importación y la nota de Astro", () => {
		expect(html).toContain("import { Ejemplo } from &quot;@jotis-me/react&quot;");
		expect(html).toMatch(/Isla con <code[^>]*>client:load<\/code>/);
		expect(html).toContain("Isla en Astro.");
		expect(button).toContain("Sin isla: se pinta en el servidor");
		expect(button).not.toContain("Isla en Astro.");
	});

	it("genera la tabla de props desde los tipos y pone el párrafo «Props.» de la ficha tras ella", () => {
		expect(html).toMatch(/<code>hierarchy<\/code>/);
		expect(html).toContain("&quot;primary&quot; · &quot;secondary&quot;");
		expect(html).toContain("Jerarquía visual del ejemplo.");
		expect(html).toMatch(/<code>label<\/code>\s*<span[^>]*>obligatoria<\/span>/);
		expect(html).toMatch(/<code>40<\/code>/);
		const [table, props] = order(html, "</table>", "Acepta además");
		expect(props).toBeGreaterThan(table);
	});

	it("muestra el código para Next.js y para Astro en el CodeSnippet de @jotis-me/react, resaltado", () => {
		const code = html.slice(html.indexOf("data-code-tabs"));
		expect(code.match(/role="tab"/g)).toHaveLength(2);
		expect(code).toContain(">Next.js</button>");
		expect(code).toContain(">Astro</button>");
		// CodeSnippet pinta solo la pestaña activa, con los colores de su ficha: nombres en utility-blue-600 y
		// palabras clave en utility-pink-600 (aquí, solo el nombre)
		expect(code.match(/role="tabpanel"/g)).toHaveLength(1);
		expect(code).toContain('<span class="text-utility-blue-600">Ejemplo</span>');
		// La pestaña de Astro va en las props de la isla
		expect(code).toContain("Ejemplo client:load");
	});

	it("con un componente del catálogo: migas, grupo, anterior/siguiente y relacionados", () => {
		expect(button).toContain('href="/components/"');
		expect(button).toContain('href="/components/#acciones"');
		expect(button).toMatch(/>Acciones<\/span>/);
		expect(button).toMatch(/href="\/components\/button-group\/"[^>]*rel="next"/);
		expect(button).not.toContain('rel="prev"');
	});

	it("los relacionados van al final, en LinkCard: los tres siguientes de su grupo, con su descripción", () => {
		const related = button.slice(button.indexOf('<nav aria-label="Relacionados"'));
		const links = [...related.slice(0, related.indexOf("</nav>")).matchAll(/<a href="([^"]+)"/g)].map(
			(m) => m[1],
		);
		expect(links).toEqual([
			"/components/button-group/",
			"/components/button-utility/",
			"/components/close-button/",
		]);
		expect(related).toMatch(/Varias opciones pegadas, con <code>items<\/code>\./);
		// Tras «Detalles y accesibilidad» y antes de anterior/siguiente; ya no en la columna derecha
		const at = order(button, ">Props</h2>", ">Relacionados</h2>", 'rel="next"');
		expect([...at].sort((a, b) => a - b)).toEqual(at);
		expect(button.slice(button.indexOf("data-toc"))).not.toContain("/components/button-group/");
	});

	it("Button: «Cuándo usarlo» enseña un primario y un secundario «Esto sí» y dos primarios «Esto no», con Button", () => {
		const uso = real.slice(
			real.indexOf('<section aria-labelledby="uso"'),
			real.indexOf('<section aria-labelledby="evita"'),
		);
		const figures = [...uso.matchAll(/<figure[\s\S]*?<\/figure>/g)].map((m) => m[0]);
		expect(figures).toHaveLength(2);
		const [yes, no] = figures as [string, string];
		const buttons = (figure: string) =>
			[...figure.matchAll(/<button[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/button>/g)].map((m) => ({
				primary: /\bbg-brand-solid\b/.test(m[1] as string),
				text: (m[2] as string).replace(/<[^>]+>/g, "").trim(),
			}));
		expect(yes).toContain("Esto sí");
		expect(buttons(yes)).toEqual([
			{ primary: false, text: "Cancelar" },
			{ primary: true, text: "Guardar" },
		]);
		expect(no).toContain("Esto no");
		expect(buttons(no)).toEqual([
			{ primary: true, text: "Guardar" },
			{ primary: true, text: "Exportar" },
		]);
		// El pie es la frase de la ficha y el espécimen no se puede pulsar ni enfocar
		expect(yes).toMatch(/Una sola <code[^>]*>primary<\/code> por vista o por modal/);
		expect(no).toContain("No apiles dos primarios.");
		for (const f of figures) expect(f).toMatch(/<div inert=""/);
		// Sin isla: ningún espécimen se hidrata
		expect(uso).not.toContain("astro-island");
	});

	it("con pares, «Evita» es una sección con su título y el resto de la ficha no se repite", () => {
		const titles = [...real.matchAll(/<h2[^>]*>([^<]*)<\/h2>/g)].map((m) => m[1]);
		expect(titles).toEqual(
			expect.arrayContaining(["Cuándo usarlo", "Evita", "Detalles y accesibilidad"]),
		);
		const evita = real.slice(real.indexOf('<section aria-labelledby="evita"'));
		expect(evita.slice(0, evita.indexOf("</section>"))).toContain("No cambies la forma");
		expect(real.match(/No apiles dos primarios\./g)).toHaveLength(1);
		const toc = real.slice(real.indexOf('aria-label="En esta página"'));
		for (const s of ["uso", "evita", "detalles", "relacionados"]) expect(toc).toContain(`href="#${s}"`);
		// Badge solo tiene «Evita»
		expect(badge).toContain('<section aria-labelledby="evita"');
		expect(badge).not.toContain('<section aria-labelledby="uso"');
		expect(badge).toContain("El pago se ha completado correctamente");
	});

	it("sin pares, la ficha se pinta como texto, sin tarjetas de ejemplo", () => {
		expect(html).not.toContain("<figure");
		expect(html).toContain('data-card-section="evita"');
		expect(html).toContain("Usarlo en producción.");
		// Los pares de Button no encajan con una ficha que no es la suya: tampoco hay tarjetas
		expect(button).not.toContain("Esto sí");
	});

	it("el índice «En esta página» lista las secciones que hay", () => {
		const toc = html.slice(html.indexOf('aria-label="En esta página"'));
		for (const s of ["uso", "props", "codigo", "detalles"]) expect(toc).toContain(`href="#${s}"`);
		// Fuera del catálogo no hay relacionados
		expect(html).not.toContain("Relacionados");
	});
});
