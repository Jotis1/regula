// Los SVG de logos de terceros que guarda scripts/import-logos.ts en assets/logos/ (design D7 de add-minor-variants).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { slugOf } from "../scripts/import-logos.ts";

const dir = join(import.meta.dirname, "../assets/logos");
const sets = ["app", "integration", "social"] as const;
const files = Object.fromEntries(
	sets.map((s) => [s, readdirSync(join(dir, s)).filter((f) => f.endsWith(".svg"))]),
) as Record<(typeof sets)[number], string[]>;
const read = (set: string, f: string) => readFileSync(join(dir, set, f), "utf8");
const figma = JSON.parse(readFileSync(join(dir, "figma.json"), "utf8")) as Record<
	string,
	{ items: [string, string, number, number][] }
>;

describe("logos de terceros (assets/logos)", () => {
	it("232 de apps, 16 integraciones y 34 sociales, estas dos en color y en gris", () => {
		expect(files.app).toHaveLength(232);
		expect(files.app.some((f) => f.endsWith("-gray.svg"))).toBe(false);
		for (const [set, n] of [
			["integration", 16],
			["social", 34],
		] as const) {
			const color = files[set].filter((f) => !f.endsWith("-gray.svg"));
			expect(color, set).toHaveLength(n);
			for (const f of color)
				expect(files[set], `${set}/${f}`).toContain(f.replace(".svg", "-gray.svg"));
		}
	});

	it("los nombres salen de figma.json: los mismos ficheros, ni más ni menos", () => {
		for (const set of sets) {
			const expected =
				figma[set]?.items.map(([name, category]) => `${slugOf(set, name, category)}.svg`) ?? [];
			expect([...files[set]].sort(), set).toEqual([...expected].sort());
		}
		// Los dos «swift» del Figma: el lenguaje y la red de pagos
		expect(files.app).toContain("swift.svg");
		expect(files.app).toContain("swift-payments.svg");
	});

	it("cada SVG tiene viewBox y tamaño, y ningún resto del exportador de Figma", () => {
		for (const set of sets)
			for (const f of files[set]) {
				const svg = read(set, f);
				expect(svg, `${set}/${f}`).toMatch(
					/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" width="\d+" height="\d+" viewBox="[\d. ]+"/,
				);
				expect(svg, `${set}/${f}`).not.toMatch(/foreignObject|data-figma|style="mask-type/);
			}
	});

	it("los ids no se repiten entre logos y cada referencia apunta a un id del mismo fichero", () => {
		const all = new Map<string, string>();
		for (const set of sets)
			for (const f of files[set]) {
				const svg = read(set, f);
				const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1] as string);
				for (const id of ids) {
					expect(all.get(id), `${id} en ${set}/${f} y en ${all.get(id)}`).toBeUndefined();
					all.set(id, `${set}/${f}`);
				}
				for (const m of svg.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g))
					expect(ids, `${set}/${f}`).toContain(m[1] ?? m[2]);
			}
	});

	it("los grises de un solo color pintan con currentColor", () => {
		for (const set of ["integration", "social"] as const) {
			const grays = files[set].filter((f) => f.endsWith("-gray.svg"));
			const mono = grays.filter((f) => read(set, f).includes("currentColor"));
			// Todos los sociales; en integraciones, todos menos alguno con dos tonos de gris
			if (set === "social") expect(mono).toHaveLength(grays.length);
			else expect(mono.length).toBeGreaterThanOrEqual(grays.length - 2);
		}
	});
});
