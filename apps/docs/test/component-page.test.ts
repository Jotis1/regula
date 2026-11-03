import { loadRenderers } from "astro:container";
import { fileURLToPath } from "node:url";
import { getContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import ComponentPage from "../src/layouts/ComponentPage.astro";
import { propsOf } from "../src/lib/props";

const fixture = fileURLToPath(new URL("./fixtures/Ejemplo.tsx", import.meta.url));
let html = "";

beforeAll(async () => {
	// El layout lleva una isla React (la búsqueda de la cabecera)
	const renderers = await loadRenderers([getContainerRenderer()]);
	const container = await AstroContainer.create({ renderers });
	html = await container.renderToString(ComponentPage, {
		props: {
			name: "Ejemplo",
			description: "Componente de prueba de la plantilla.",
			props: propsOf(fixture, "Ejemplo"),
			next: '<Ejemplo label="Guardar" />',
			astro: '<Ejemplo client:load label="Guardar" />',
		},
		slots: {
			guide: "<p>Úsalo para probar la plantilla.</p>",
			examples: '<button type="button">Guardar</button>',
		},
		request: new Request("https://regula.jotis.me/components/ejemplo/"),
	});
});

describe("plantilla de página de componente", () => {
	it("tiene título, descripción, la ficha y las secciones de ejemplos, props y código", () => {
		expect(html).toContain("<h1");
		expect(html).toContain("Componente de prueba de la plantilla.");
		// «Cuándo usarlo» y «Detalles» los pinta la ficha repartida (CardSections), que llega por la ranura guide
		for (const s of ["Ejemplos", "Props", "Código"]) expect(html).toContain(`>${s}</h2>`);
		expect(html).toContain("Úsalo para probar la plantilla.");
		expect(html).toContain('<button type="button">Guardar</button>');
	});

	it("genera la tabla de props desde los tipos del componente", () => {
		expect(html).toMatch(/<code>hierarchy<\/code>/);
		expect(html).toContain("&quot;primary&quot; · &quot;secondary&quot;");
		expect(html).toContain("Jerarquía visual del ejemplo.");
		expect(html).toMatch(/<code>label<\/code>\s*<span[^>]*>obligatoria<\/span>/);
		expect(html).toMatch(/<code>40<\/code>/);
	});

	it("muestra el código para Next.js y para Astro en pestañas accesibles", () => {
		expect(html.match(/role="tab"/g)).toHaveLength(2);
		expect(html).toContain(">Next.js</button>");
		expect(html).toContain(">Astro</button>");
		expect(html).toContain("&lt;Ejemplo label=&quot;Guardar&quot; /&gt;");
		expect(html).toContain("client:load");
		expect(html.match(/role="tabpanel"/g)).toHaveLength(2);
		expect(html).toMatch(/role="tabpanel"[^>]*hidden/);
	});
});
