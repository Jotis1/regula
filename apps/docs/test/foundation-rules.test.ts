// Reglas con ejemplos en los fundamentos (design D6 de redesign-docs-site-v2): las páginas que enuncian reglas abren
// con pares de `ExampleCard` (las piezas `Pair` y `Rule`), y «En lugar de esto, esto otro» de Contenido y tono enseña
// cada caso con el mismo componente con el texto malo y con el bueno.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const src = join(import.meta.dirname, "../src");
const page = (slug: string) => readFileSync(join(src, "content/foundations", `${slug}.mdx`), "utf8");
const pairs = (mdx: string) => [...mdx.matchAll(/<Pair[\s\S]*?<\/Pair>/g)].map((m) => m[0]);
const verdicts = (pair: string) => [...pair.matchAll(/<Rule verdict="([a-z]+)"/g)].map((m) => m[1]);
/** Los componentes del paquete que pinta un trozo de .mdx, en orden. */
const components = (mdx: string) =>
	[...mdx.matchAll(/<([A-Z][A-Za-z]*)[\s/>]/g)]
		.map((m) => m[1])
		.filter((n) => n !== "Rule" && n !== "Pair");

describe("fundamentos: reglas con ejemplos", () => {
	const WITH_RULES = [
		"principles",
		"color",
		"typography",
		"layout",
		"states",
		"iconography",
		"backgrounds",
	];

	for (const slug of WITH_RULES)
		it(`${slug} abre con pares «Esto sí, esto no», antes de cualquier otra sección`, () => {
			const mdx = page(slug);
			const sections = [...mdx.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
			expect(sections[0]).toBe("Con ejemplos");
			const first = mdx.slice(mdx.indexOf("## Con ejemplos"), mdx.indexOf(`## ${sections[1]}`));
			const found = pairs(first);
			expect(found.length).toBeGreaterThan(0);
			for (const p of found) expect(verdicts(p)).toEqual(["do", "dont"]);
			// Cada tarjeta lleva su frase
			expect(first.match(/<Rule verdict="[a-z]+" caption=/g)).toHaveLength(found.length * 2);
		});

	it("los especímenes son inertes y se pintan en el servidor, sin isla", () => {
		const rule = readFileSync(join(src, "components/compose/Rule.astro"), "utf8");
		expect(rule).toContain("<ExampleCard verdict={verdict} caption={caption}>");
		expect(rule).toMatch(/<div\s+inert/);
		for (const slug of [...WITH_RULES, "content"]) expect(page(slug), slug).not.toMatch(/client:/);
	});
});

describe("contenido y tono: en lugar de esto, esto otro", () => {
	const mdx = page("content");
	const section = mdx.slice(
		mdx.indexOf("## En lugar de esto, esto otro"),
		mdx.indexOf("## Dónde cabe el humor"),
	);
	const cases = pairs(section);

	it("cada caso de la guía es un par «En lugar de» y «Mejor», no una fila de tabla", () => {
		expect(cases.map((c) => c.match(/<Pair title="([^"]+)"/)?.[1])).toEqual([
			"Estado vacío",
			"Error leve",
			"Confirmación",
			"Error",
			"Botón",
			"Mayúsculas",
		]);
		for (const c of cases) expect(verdicts(c)).toEqual(["instead", "better"]);
		expect(mdx).not.toContain("<Instead");
	});

	it("los dos lados enseñan el mismo componente de verdad, con el texto malo y con el bueno", () => {
		const expected = ["EmptyState", "Input", "Alert", "Input", "Button", "Button"];
		cases.forEach((c, i) => {
			const [bad, good] = c.split('<Rule verdict="better"') as [string, string];
			expect(new Set(components(bad)), c).toEqual(new Set([expected[i]]));
			expect(new Set(components(good)), c).toEqual(new Set([expected[i]]));
		});
	});

	it("conserva los textos de la guía, letra a letra", () => {
		for (const text of [
			'"No se encontraron resultados."',
			'"Aún no hay gastos. Qué calma."',
			'"Se ha producido un error de validación."',
			'"Ese correo no parece un correo. Revísalo."',
			'"Los cambios se han guardado correctamente."',
			'"Guardado. Ya no se te va a olvidar."',
			'"Error 422"',
			'"Introduce un correo válido."',
			'"Aceptar"',
			'"Guardar", "Eliminar gasto", "Exportar"',
			'"Nuevo Movimiento"',
			'"Nuevo movimiento"',
		])
			expect(section).toContain(`caption='${text}'`);
	});
});
