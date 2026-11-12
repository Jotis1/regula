import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { icons } from "../src/data/icons.js";

// Los 82 iconos que había antes de importar el set completo del Figma, con sus dibujos: conservan nombre y trazo
const original: Record<string, string[]> = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/icon-drawings-original.json"), "utf8"),
);
const entries = Object.entries(icons) as [string, readonly string[]][];

describe("datos del set de iconos", () => {
	it("tiene los 1.172 iconos del Figma (1.173 componentes con «colors» en dos categorías)", () => {
		expect(entries).toHaveLength(1172);
		expect(icons).toHaveProperty("colors");
	});

	it("nombra todo en kebab-case", () => {
		const bad = entries.map(([n]) => n).filter((n) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(n));
		expect(bad).toEqual([]);
	});

	it("conserva nombre y dibujo de los 82 iconos de antes", () => {
		expect(Object.keys(original)).toHaveLength(82);
		for (const [name, paths] of Object.entries(original)) {
			expect(icons[name as keyof typeof icons], name).toEqual(paths);
		}
	});

	it("dibuja solo con trazos absolutos dentro de la caja de 24×24", () => {
		const problems: string[] = [];
		for (const [name, paths] of entries) {
			if (paths.length === 0) problems.push(`${name}: sin trazos`);
			for (const d of paths) {
				if (!/^M[-\d.\sMLHVCSQTAZ]+$/.test(d)) problems.push(`${name}: comando no permitido`);
				for (const v of d.match(/-?\d*\.?\d+/g) ?? []) {
					const n = Number.parseFloat(v);
					// Los radios y las banderas de los arcos no son coordenadas; el resto cabe en la caja con un margen
					if (Number.isNaN(n)) problems.push(`${name}: número no válido`);
				}
				// Sin trasladar: un icono mal recortado quedaría con coordenadas de marco (cientos de px)
				const nums = (d.replace(/[A-Za-z]/g, " ").match(/-?\d*\.?\d+/g) ?? []).map(Number);
				if (nums.some((n) => n > 60 || n < -30)) problems.push(`${name}: fuera de la caja`);
			}
		}
		expect(problems).toEqual([]);
	});
});
