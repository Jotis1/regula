import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { colors } from "../dist/index.js";
import { type TokensFile, tokensCss } from "../src/generate.ts";

const read = (p: string) => JSON.parse(readFileSync(join(import.meta.dirname, p), "utf8"));
const es: TokensFile = read("../src/tokens.json");

// Nombres de los tokens de color de la guía, en su orden, fijados aquí (versión `9fe2`). La fuente de los tokens es
// src/tokens.json; quitar o renombrar uno obliga a cambiar también este fixture en el mismo PR.
const names: string[] = read("fixtures/token-names.json");

describe("tokens de la guía", () => {
	it("src/tokens.json tiene todos, en el mismo orden y sin ninguno de más", () => {
		expect(es.color.tokens.map((t) => t.name)).toEqual(names);
		// La paleta `chartreuse` de la guía 1793561361-ae73 ya no existe (1793653059-466a)
		expect(names.filter((n) => n.includes("chartreuse"))).toEqual([]);
	});

	it("los publica el módulo de TypeScript, en el mismo orden", () => {
		expect(Object.keys(colors)).toEqual(names);
	});

	it("los publica tokens.css como variables", () => {
		const css = tokensCss(es);
		const root = css.slice(css.indexOf(":root {"), css.indexOf("\n}", css.indexOf(":root {")));
		const vars = new Set([...root.matchAll(/--([\w-]+):/g)].map((m) => m[1]));
		expect(names.filter((n) => !vars.has(n))).toEqual([]);
	});
});

const notes = (t: TokensFile): string[] => {
	const groups = t as unknown as Record<string, { tokens: { usage: string }[] }>;
	return [
		...["color", "spacing", "radius", "width", "shadow", "blur"].flatMap((k) =>
			(groups[k]?.tokens ?? []).map((x) => x.usage),
		),
		...(t as unknown as { type: { groups: { styles: { usage?: string }[] }[] } }).type.groups.flatMap(
			(g) => g.styles.flatMap((s) => (s.usage ? [s.usage] : [])),
		),
	];
};

// Las notas de uso se tradujeron una vez desde la guía (antiguo scripts/translate-usage.ts); el castellano es la fuente.
describe("notas de uso en castellano", () => {
	it("no quedan restos en inglés", () => {
		for (const note of notes(es))
			expect(note).not.toMatch(/\b(on hover|Step \d|and the|Pair with|between|inside)\b/);
	});
});
