import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => JSON.parse(readFileSync(join(import.meta.dirname, p), "utf8"));
const es = read("../src/tokens.json");
const guide = read("../../../reference/tokens.json");

// La guía y src/tokens.json tienen los mismos tokens, con la paleta `chartreuse` incluida: solo cambia el texto de
// las notas de uso, que aquí está en castellano.

describe("tokens de la guía", () => {
	it("están todos, también utility-chartreuse-50…700, y en el mismo orden", () => {
		const names = (t: typeof es) => t.color.tokens.map((x: { name: string }) => x.name);
		expect(names(es)).toEqual(names(guide));
		const chartreuse = names(es).filter((n: string) => /^utility-chartreuse-/.test(n));
		expect(chartreuse).toEqual(
			[50, 100, 200, 300, 400, 500, 600, 700].map((n) => `utility-chartreuse-${n}`),
		);
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
		const b = notes(guide);
		expect(a).toHaveLength(b.length);
		for (const [i, note] of a.entries()) expect(note, b[i]).not.toBe(b[i]);
	});

	it("no quedan restos en inglés", () => {
		for (const note of notes(es))
			expect(note).not.toMatch(/\b(on hover|Step \d|and the|Pair with|between|inside)\b/);
	});

	it("los valores no cambian: solo el texto", () => {
		expect(es.color.tokens.map((t: { value: unknown }) => t.value)).toEqual(
			guide.color.tokens.map((t: { value: unknown }) => t.value),
		);
	});
});
