import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import { THUMBNAILS } from "../src/visual/thumbnails";
import { CROP_ALIGN, FADE, fadeMask, PREVIEW_BOX, SHRUNK_PENDING } from "../src/visual/thumbs";

/** El trozo del fuente de cada muestra, para ver si pinta un `ScaledPreview`. */
function sourceOf(): Record<string, string> {
	const src = readFileSync(join(import.meta.dirname, "../src/visual/thumbnails.tsx"), "utf8");
	const start = src.indexOf("export const THUMBNAILS");
	const body = src.slice(start);
	const out: Record<string, string> = {};
	const keys = [...body.matchAll(/^\t([A-Z][A-Za-z0-9]*): \{/gm)];
	keys.forEach((m, i) => {
		out[m[1] as string] = body.slice(m.index, keys[i + 1]?.index ?? body.length);
	});
	return out;
}

describe("muestras de las cards a tamaño real", () => {
	it("ninguna muestra se encoge, salvo las pendientes de 2.2", () => {
		const source = sourceOf();
		const shrunk = Object.entries(THUMBNAILS)
			.filter(
				([name, t]) =>
					(t.scale ?? 1) < 1 ||
					(name !== "ScaledPreview" && /<ScaledPreview\b/.test(source[name] ?? "")),
			)
			.map(([name]) => name)
			.sort();
		expect(shrunk, "muestras encogidas: rehacerlas a tamaño real").toEqual([...SHRUNK_PENDING].sort());
	});

	it("una muestra que declara escala la declara menor que 1 y mayor que 0 (solo las pendientes)", () => {
		for (const [name, t] of Object.entries(THUMBNAILS)) {
			if (t.scale === undefined) continue;
			expect(SHRUNK_PENDING, name).toContain(name);
			expect(t.scale, name).toBeGreaterThan(0);
			expect(t.scale, name).toBeLessThan(1);
		}
	});

	it("cada componente del catálogo tiene su muestra", () => {
		expect(catalogComponents().filter((n) => !THUMBNAILS[n])).toEqual([]);
	});

	it("solo hay muestras de componentes del catálogo", () => {
		const catalog = new Set(catalogComponents());
		expect(Object.keys(THUMBNAILS).filter((n) => !catalog.has(n))).toEqual([]);
	});
});

describe("recorte con fundido", () => {
	it("el escenario es 16/10 y cabe en la card más estrecha", () => {
		expect(PREVIEW_BOX.width / PREVIEW_BOX.height).toBeCloseTo(16 / 10, 10);
	});

	it("cada ancla alinea la muestra y tiene su máscara", () => {
		for (const crop of ["center", "top", "top-left"] as const) {
			expect(CROP_ALIGN[crop]).toMatch(/items-/);
			expect(fadeMask(crop)).toContain(`${FADE}px`);
		}
		// anclada arriba a la izquierda no se desvanece ni arriba ni a la izquierda
		expect(fadeMask("top-left")).not.toContain("transparent,");
		expect(fadeMask("center").match(/linear-gradient/g)).toHaveLength(4);
	});

	it("las anclas declaradas existen", () => {
		for (const [name, t] of Object.entries(THUMBNAILS))
			if (t.crop) expect(Object.keys(CROP_ALIGN), name).toContain(t.crop);
	});
});
