// El buscador del índice de componentes (src/lib/component-index.ts): qué se busca en cada card y cuándo coincide.
// Se prueba con las fichas y el catálogo reales, que es de donde la página saca el texto de cada card.
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { COMPONENT_KEYWORDS, catalogComponents, labelOf, slugOf } from "../src/lib/catalog";
import { countText, matches, queryWords, searchText } from "../src/lib/component-index";

const dir = fileURLToPath(new URL("../src/content/components/", import.meta.url));
const descriptions = new Map(
	readdirSync(dir)
		.filter((f) => f.endsWith(".md"))
		.map((f) => {
			const source = readFileSync(`${dir}${f}`, "utf8");
			return [f.replace(/\.md$/, ""), source.match(/^description:\s*"?(.*?)"?\s*$/m)?.[1] ?? ""];
		}),
);

/** Los componentes que deja el buscador con lo escrito, como en la página. */
const search = (query: string) =>
	catalogComponents().filter((name) => {
		const slug = slugOf(name);
		const text = searchText(labelOf(name), slug, descriptions.get(slug) ?? "", COMPONENT_KEYWORDS[slug]);
		return matches(text, queryWords(query));
	});

describe("buscador del índice de componentes", () => {
	it("«fecha» deja DatePicker y CalendarView, aunque su nombre no la contenga", () => {
		expect(search("fecha")).toEqual(["DatePicker", "CalendarView"]);
	});

	it("«botonn» no deja ninguno", () => {
		expect(search("botonn")).toEqual([]);
	});

	it("sin nada escrito, o solo espacios, quedan todos", () => {
		expect(search("")).toHaveLength(catalogComponents().length);
		expect(search("   ")).toHaveLength(catalogComponents().length);
	});

	it("encuentra por el nombre como se lee y como se escribe en el código, sin tildes ni mayúsculas", () => {
		expect(search("date picker")).toContain("DatePicker");
		expect(search("DatePicker")).toEqual(["DatePicker"]);
		expect(search("GRAFICA").length).toBeGreaterThan(0);
	});

	it("encuentra por palabra clave: «tabla» deja Table y «boton», Button", () => {
		expect(search("tabla")).toContain("Table");
		expect(search("boton")).toContain("Button");
	});

	it("con varias palabras tienen que estar todas, en cualquier orden", () => {
		expect(search("rango fecha")).toEqual(["DatePicker"]);
		expect(search("fecha botonn")).toEqual([]);
	});

	it("lo que propone el campo y el estado vacío encuentra algo", () => {
		for (const q of ["fecha", "aviso", "tabla"]) expect(search(q).length, q).toBeGreaterThan(0);
	});

	it("toda palabra clave del catálogo es de un componente que existe", () => {
		const slugs = new Set(catalogComponents().map(slugOf));
		expect(Object.keys(COMPONENT_KEYWORDS).filter((k) => !slugs.has(k))).toEqual([]);
	});

	it("el recuento dice cuántos quedan del total, o que no hay resultados", () => {
		expect(countText(2, 126)).toBe("2 de 126 componentes");
		expect(countText(0, 126)).toBe("Sin resultados");
	});
});
