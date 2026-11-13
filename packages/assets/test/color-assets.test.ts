// Todo SVG de color que guarda el paquete (logos, banderas, pagos, archivos…) tiene que ser XML válido: Figma exporta
// cosas como `xlink:href` sin declarar su espacio de nombres, y un SVG así se rompe al usarlo como imagen.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const assets = join(import.meta.dirname, "../assets");
const walk = (dir: string): string[] =>
	readdirSync(dir).flatMap((f) => {
		const p = join(dir, f);
		return statSync(p).isDirectory() ? walk(p) : p.endsWith(".svg") ? [p] : [];
	});

describe("SVG de color", () => {
	for (const family of ["logos", "payments", "cursors"]) {
		it(`los de ${family} son XML válido`, () => {
			const bad: string[] = [];
			const parser = new DOMParser();
			for (const file of walk(join(assets, family))) {
				const doc = parser.parseFromString(readFileSync(file, "utf8"), "image/svg+xml");
				if (doc.getElementsByTagName("parsererror").length || doc.documentElement.tagName !== "svg")
					bad.push(file.slice(assets.length + 1));
			}
			expect(bad).toEqual([]);
		});
	}
});
