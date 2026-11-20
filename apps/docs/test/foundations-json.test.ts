// `/foundations.json` (spec mcp-server, «Fundamentos en JSON», «Texto de los componentes de la guía» and «Componentes
// sin clasificar»): every foundation with its sections, and the text the page says inside its components.
import { describe, expect, it } from "vitest";
import { foundationsJson } from "../src/lib/foundations-json";
import { deps, entries, entryOf } from "./foundations-fixture";

const json = foundationsJson(entries, deps, "1.2.3", "https://regula.jotis.me/");
const foundation = (id: string) => {
	const found = json.foundations.find((f) => f.id === id);
	if (!found) throw new Error(`no foundation ${id}`);
	return found;
};
const section = (id: string, title: string) =>
	foundation(id).sections.find((s) => s.title === title)?.text ?? "";

/** The JSON of one invented page. */
const only = (body: string, file = "nuevo.mdx") =>
	foundationsJson(
		[entryOf("nuevo", `---\ntitle: Nuevo\ndescription: Prueba\norder: 1\n---\n${body}`, file)],
		deps,
		"1.2.3",
		"https://regula.jotis.me/",
	);

describe("foundationsJson", () => {
	it("trae la versión y los diez fundamentos, en el orden de la navegación", () => {
		expect(json.version).toBe("1.2.3");
		expect(json.foundations.map((f) => f.id)).toEqual([
			"principles",
			"content",
			"color",
			"typography",
			"layout",
			"states",
			"iconography",
			"backgrounds",
			"stream",
			"brand",
		]);
		expect(foundation("color")).toMatchObject({
			title: "Color",
			order: 3,
			url: "https://regula.jotis.me/foundations/color/",
		});
	});

	it("cada `##` de tipografía es una sección, con su ancla, y detrás van las de sus tablas de tokens", () => {
		expect(foundation("typography").sections.map((s) => [s.title, s.url.split("#")[1]])).toEqual([
			["Con ejemplos", "con-ejemplos"],
			["Las tres familias", "las-tres-familias"],
			["Pesos y párrafos", "pesos-y-párrafos"],
			["Display", "tokens-display"],
			["Text", "tokens-text"],
			["Code", "tokens-code"],
		]);
		expect(section("typography", "Display")).toContain("`search_tokens`, categoría `type`");
		expect(section("layout", "Radios")).toContain("categoría `radius`");
	});

	it("el texto anterior al primer `##` es la introducción", () => {
		expect(foundation("color").intro).toMatch(/^Los tokens son \*\*semánticos\*\*: elige por función/);
	});

	it("el pie de una regla lleva delante la etiqueta de su veredicto", () => {
		const text = section("color", "Con ejemplos");
		expect(text).toContain("**Esto sí.** Un estado siempre lleva palabra o icono además del color.");
		expect(text).toContain(
			"**Esto no.** Dos puntos de color no dicen nada a quien no distingue el verde del rojo.",
		);
		expect(section("content", "En lugar de esto, esto otro")).toContain(
			'**Estado vacío**\n\n**En lugar de.** "No se encontraron resultados."\n\n**Mejor.**',
		);
	});

	it("los textos de una demo no entran", () => {
		const text = section("color", "Con ejemplos");
		for (const word of ["Exportar", "Filtrar", "Nuevo gasto", "Pagado"]) expect(text).not.toContain(word);
	});

	it("trae los apartados de esenciales, términos y formatos, lo que cabe y el pie de un ejemplo", () => {
		expect(section("color", "Lo esencial")).toContain("**Fondos.** Página y tarjetas en `bg-primary`.");
		expect(section("typography", "Las tres familias")).toContain("**Texto.** **Geist** (`--font-body`)");
		expect(section("content", "Cifras y fechas")).toContain("**Importe.** 1.284,50 €");
		expect(section("content", "Dónde cabe el humor")).toContain(
			"**Cabe:** Estados vacíos, Confirmaciones, Cargas, Errores sin consecuencias",
		);
		expect(section("typography", "Las tres familias")).toContain(
			"Las tres familias en sus estilos de uso",
		);
	});

	it("lo que la página saca de los tokens también se lee: las excepciones de contraste y dónde están los de color", () => {
		expect(section("color", "Contraste")).toMatch(
			/- `border-primary` \(\d,\d+:1 en claro, .+ en oscuro\): /,
		);
		expect(section("color", "Tokens")).toContain("`search_tokens`, categoría `color`");
	});

	it("una tabla de Markdown sigue siendo una tabla", () => {
		expect(section("brand", "Iconos de app")).toContain(
			"| App | Letras | Tono |\n| --- | --- | --- |\n| Ornatus | Or | `indigo` |",
		);
	});

	it("ninguna sección se queda sin texto", () => {
		for (const f of json.foundations)
			for (const s of f.sections) expect(s.text, `${f.id}: ${s.title}`).not.toBe("");
	});

	it("un componente sin clasificar para la lectura y nombra el componente y el archivo", () => {
		expect(() => only("## Uno\n\n<Nuevo />\n", "src/content/foundations/nuevo.mdx")).toThrow(
			/src\/content\/foundations\/nuevo\.mdx: <Nuevo> is not classified/,
		);
	});

	it("una prop con texto que no es un literal también la para", () => {
		expect(() => only("## Uno\n\n<Essentials items={ITEMS} />\n")).toThrow(
			/`items` of <Essentials> is not a literal/,
		);
	});

	it("las props que no llevan texto no se leen: un icono no es un literal y no molesta", () => {
		const page = only('## Uno\n\n<Essentials icon={Inbox01} items={[{ title: "A", text: `b` }]} />\n');
		expect(page.foundations[0]?.sections[0]?.text).toBe("**A.** b");
	});
});
