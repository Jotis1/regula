import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import { THUMBNAILS } from "../src/visual/thumbnails";
import { CROP_ALIGN, FADE, fadeMask, PREVIEW_BOX } from "../src/visual/thumbs";

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
	it("ninguna muestra se encoge: ni declara escala ni pinta un ScaledPreview (salvo la del propio ScaledPreview)", () => {
		const source = sourceOf();
		const shrunk = Object.keys(THUMBNAILS).filter(
			(name) =>
				(name !== "ScaledPreview" && /<ScaledPreview[\s>]/.test(source[name] ?? "")) ||
				/[\s{,]scale: [0-9.]+/.test(source[name] ?? ""),
		);
		expect(shrunk, "muestras encogidas: rehacerlas a tamaño real").toEqual([]);
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
