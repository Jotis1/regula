import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// La fuente de los trazos y patrones es assets/ del propio paquete (copiados de la guía `9fe2`)
const sources = join(import.meta.dirname, "../assets");
const dist = join(import.meta.dirname, "../dist");

describe.each([
	["Hand-drawn", "hand-drawn", 87],
	["Patterns", "patterns", 4],
])("%s", (_group, folder, count) => {
	it("publica todos los ficheros de assets/ con la tinta en currentColor", () => {
		const expected = readdirSync(join(sources, folder)).filter((f) => f.endsWith(".svg"));
		expect(expected).toHaveLength(count);
		const files = readdirSync(join(dist, folder));
		expect(files.sort()).toEqual(expected.sort());
		for (const f of files) {
			const svg = readFileSync(join(dist, folder, f), "utf8");
			expect(svg, f).not.toMatch(/#171717/i);
			expect(svg, f).toContain("currentColor");
		}
	});
});
