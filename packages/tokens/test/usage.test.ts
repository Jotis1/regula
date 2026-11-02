import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => JSON.parse(readFileSync(join(import.meta.dirname, p), "utf8"));
const es = read("../src/tokens.json");
const guide = read("../../../reference/tokens.json");

// Lo que la guía trae y aún no se porta (design §12: la paleta `chartreuse` de la versión 1793561361-ae73 queda
// para un cambio de estilo propio). Se quita de la guía antes de comparar; todo lo demás tiene que coincidir.
const UNPORTED = /^utility-chartreuse-/;
const en = {
	...guide,
	color: {
		...guide.color,
		tokens: guide.color.tokens.filter((t: { name: string }) => !UNPORTED.test(t.name)),
	},
};

describe("tokens sin portar", () => {
	it("solo falta la paleta chartreuse, y nada más difiere en los nombres", () => {
		const names = (t: typeof es) => t.color.tokens.map((x: { name: string }) => x.name);
		const onlyInGuide = names(guide).filter((n: string) => !names(es).includes(n));
		expect(onlyInGuide).toHaveLength(8);
		expect(onlyInGuide.every((n: string) => UNPORTED.test(n))).toBe(true);
		expect(names(es)).toEqual(names(en));
	});
});

const notes = (t: typeof es): string[] => [
	...["color", "spacing", "radius", "width", "shadow", "blur"].flatMap((k) =>
		t[k].tokens.map((x: { usage: string }) => x.usage),
	),
	...t.type.groups.flatMap((g: { styles: { usage?: string }[] }) =>
		g.styles.flatMap((s) => (s.usage ? [s.usage] : [])),
	),
];

describe("notas de uso en castellano", () => {
	it("cada nota está traducida respecto al original de la guía", () => {
		const a = notes(es);
		const b = notes(en);
		expect(a).toHaveLength(b.length);
		for (const [i, note] of a.entries()) expect(note, b[i]).not.toBe(b[i]);
	});

	it("no quedan restos en inglés", () => {
		for (const note of notes(es))
			expect(note).not.toMatch(/\b(on hover|Step \d|and the|Pair with|between|inside)\b/);
	});

	it("los valores no cambian: solo el texto", () => {
		expect(es.color.tokens.map((t: { value: unknown }) => t.value)).toEqual(
			en.color.tokens.map((t: { value: unknown }) => t.value),
		);
	});
});
