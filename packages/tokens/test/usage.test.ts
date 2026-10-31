import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => JSON.parse(readFileSync(join(import.meta.dirname, p), "utf8"));
const es = read("../src/tokens.json");
const en = read("../../../reference/tokens.json");

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
