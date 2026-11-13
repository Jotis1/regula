// Esqueleto común de las páginas (design D1 de redesign-docs-site-v2): un solo `h1` (el del `PageHeader`), las
// secciones en `h2`, el índice «En esta página» como `Tabs` de enlaces de ancla y sin el desplegable de móvil.
import { loadRenderers } from "astro:container";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { getContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import ComponentPage from "../src/layouts/ComponentPage.astro";
import FoundationPage from "../src/layouts/FoundationPage.astro";
import { splitCard } from "../src/lib/card";
import { propsOf } from "../src/lib/props";

const fixture = fileURLToPath(new URL("./fixtures/Ejemplo.tsx", import.meta.url));
const card = splitCard(
	[
		"**Cuándo usarlo.** Úsalo para probar.",
		"**Evita.** Usarlo en producción.",
		"**Foco.** Anillo de 4 px.",
	].join("\n\n"),
);

const count = (html: string, re: RegExp) => html.match(re)?.length ?? 0;
const h1s = (html: string) => count(html, /<h1[\s>]/g);
const h2s = (html: string) =>
	[...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => m[1]?.replace(/<[^>]+>/g, "").trim());

let component = "";
let foundation = "";

beforeAll(async () => {
	const renderers = await loadRenderers([getContainerRenderer()]);
	const container = await AstroContainer.create({ renderers });
	component = await container.renderToString(ComponentPage, {
		props: {
			name: "Button",
			description: "La acción de la pantalla.",
			card,
			props: propsOf(fixture, "Ejemplo"),
			next: "<Button />",
			astro: "<Button />",
		},
		request: new Request("https://regula.jotis.me/components/button/"),
	});
	foundation = await container.renderToString(FoundationPage, {
		props: {
			slug: "color",
			title: "Color",
			description: "Los tokens son semánticos.",
			headings: [
				{ depth: 2, slug: "lo-esencial", text: "Lo esencial" },
				{ depth: 2, slug: "contraste", text: "Contraste" },
			],
			source: "apps/docs/src/content/foundations/color.mdx",
		},
		slots: { default: "<p>Texto.</p>" },
		request: new Request("https://regula.jotis.me/foundations/color/"),
	});
});

describe("esqueleto común de página", () => {
	it("la de componente tiene un solo h1, con el nombre, y sus secciones en h2", () => {
		expect(h1s(component)).toBe(1);
		expect(component).toMatch(/<h1[^>]*>Button<\/h1>/);
		const titles = h2s(component);
		for (const t of ["Cuándo usarlo", "Props", "Código"]) expect(titles).toContain(t);
		expect(component).not.toMatch(/<h[3-6][^>]*>(Props|Código)</);
	});

	it("la de fundamentos tiene un solo h1, con el título", () => {
		expect(h1s(foundation)).toBe(1);
		expect(foundation).toMatch(/<h1[^>]*>Color<\/h1>/);
	});

	it("la importación va en un campo de solo lectura con su botón de copiar", () => {
		expect(component).toMatch(
			/<input[^>]*readonly[^>]*value="import \{ Button \} from &quot;@jotis-me\/react&quot;"/i,
		);
		expect(component).toContain('data-copy="import { Button } from &quot;@jotis-me/react&quot;"');
		expect(component).toMatch(/<button[^>]*>[\s\S]*?Copiar/);
	});

	it("el índice «En esta página» es una nav de enlaces de ancla con el primero marcado, sin el desplegable de móvil", () => {
		for (const html of [component, foundation]) {
			expect(html).not.toMatch(/<summary[^>]*>\s*En esta página/);
			const nav = html.slice(html.indexOf('<nav aria-label="En esta página"'));
			expect(nav).not.toBe("");
			expect(nav).not.toContain('role="tablist"');
			expect(count(nav.slice(0, nav.indexOf("</nav>")), /aria-current="location"/g)).toBe(1);
		}
		expect(component).toContain('href="#props"');
		expect(foundation).toContain('href="#lo-esencial"');
		// Solo se pinta en escritorio
		expect(component).toMatch(/data-toc[^>]*class="[^"]*\bhidden\b[^"]*\bxl:flex\b/);
	});
});

describe("páginas con su propia cabecera", () => {
	const page = (file: string) => readFileSync(join(import.meta.dirname, "../src", file), "utf8");
	const WITH_HEADER = [
		"pages/changelog.astro",
		"pages/components/index.astro",
		"pages/icons/index.astro",
		"pages/icons/logos.astro",
		"pages/icons/flags.astro",
		"pages/icons/payments.astro",
		"pages/icons/files.astro",
		"pages/icons/cursors.astro",
		"layouts/ComponentPage.astro",
		"layouts/FoundationPage.astro",
	];
	for (const file of WITH_HEADER)
		it(`${file} usa PageHeader y no pinta su propio h1`, () => {
			expect(page(file)).toMatch(/import \{[^}]*\bPageHeader\b[^}]*\} from "@jotis-me\/react"/);
			expect(page(file)).not.toMatch(/<h1[\s>]/);
		});

	for (const file of ["pages/index.astro", "pages/404.astro"])
		it(`${file} lleva su propio titular, no un PageHeader`, () => {
			expect(page(file)).not.toContain("PageHeader");
			expect(page(file)).toMatch(/<h1[\s>]/);
		});
});
