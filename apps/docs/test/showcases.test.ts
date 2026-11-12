// Capturas de las cards de /components/ (change adopt-untitled-ui-icons): cada componente del catálogo tiene las suyas, cada una
// y todas juntas pesan poco, y la cuenta con la que la página las ajusta al marco es la de `fitScale`.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { catalogComponents, slugOf } from "../src/lib/catalog";
import { DARK_PREVIEWS } from "../src/visual/cards";
import {
	fitScale,
	SHOWCASE_BOX,
	SHOWCASE_FILL,
	SHOWCASE_IMAGE,
	SHOWCASE_MAX_BYTES,
	SHOWCASE_SCALE,
	showcaseFile,
} from "../src/visual/showcase";
import { SHOWCASES } from "../src/visual/showcases";

const dir = join(import.meta.dirname, "../src/assets/showcase");
const needed = (name: string) =>
	(DARK_PREVIEWS.has(name) ? (["dark"] as const) : (["light", "dark"] as const)).map((t) =>
		showcaseFile(slugOf(name), t),
	);

describe("muestras de las cards", () => {
	it("cada componente del catálogo tiene su muestra, y solo ellos", () => {
		const catalog = catalogComponents();
		expect(catalog.filter((n) => !SHOWCASES[n])).toEqual([]);
		expect(Object.keys(SHOWCASES).filter((n) => !catalog.includes(n))).toEqual([]);
	});

	it("el marco es 16/10 y la imagen guardada tiene su misma proporción", () => {
		expect(SHOWCASE_BOX.width / SHOWCASE_BOX.height).toBeCloseTo(16 / 10, 10);
		expect(SHOWCASE_IMAGE.width / SHOWCASE_IMAGE.height).toBeCloseTo(16 / 10, 10);
	});
});

describe("capturas guardadas", () => {
	it("cada componente tiene su captura clara y oscura (los de Stream, solo la oscura)", () => {
		const missing = catalogComponents().flatMap((name) =>
			needed(name)
				.filter((f) => !existsSync(join(dir, f)))
				.map((f) => `${name}: falta ${f}`),
		);
		expect(missing).toEqual([]);
	});

	it("no sobra ninguna captura de un componente que ya no existe", () => {
		const expected = new Set(catalogComponents().flatMap(needed));
		expect(readdirSync(dir).filter((f) => f.endsWith(".webp") && !expected.has(f))).toEqual([]);
	});

	it("cada imagen y el conjunto pesan menos que el máximo del repo", () => {
		const sizes = readdirSync(dir)
			.filter((f) => f.endsWith(".webp"))
			.map((f) => [f, statSync(join(dir, f)).size] as const);
		const heavy = sizes
			.filter(([, n]) => n > SHOWCASE_MAX_BYTES.each)
			.map(([f, n]) => `${f}: ${(n / 1024).toFixed(1)} kB`);
		expect(heavy, `imágenes de más de ${SHOWCASE_MAX_BYTES.each / 1024} kB`).toEqual([]);
		const total = sizes.reduce((sum, [, n]) => sum + n, 0);
		expect(total, `conjunto de ${(total / 1024 / 1024).toFixed(2)} MB`).toBeLessThanOrEqual(
			SHOWCASE_MAX_BYTES.total,
		);
	});
});

describe("ajuste al marco", () => {
	it("una muestra pequeña se agranda hasta ocupar su parte del marco, sin pasar del máximo", () => {
		// una barra de 300×40 px: lo limita el ancho
		expect(fitScale(300, 40)).toBeCloseTo((SHOWCASE_BOX.width * SHOWCASE_FILL) / 300, 6);
		// un icono de 20×20 px: lo limita el máximo
		expect(fitScale(20, 20)).toBe(SHOWCASE_SCALE.max);
	});

	it("una muestra grande se encoge hasta caber, sin pasar del mínimo", () => {
		expect(fitScale(1200, 300)).toBeCloseTo((SHOWCASE_BOX.width * SHOWCASE_FILL) / 1200, 6);
		expect(fitScale(4000, 4000)).toBe(SHOWCASE_SCALE.min);
	});

	it("una muestra de la proporción del marco queda a la escala que dice el relleno", () => {
		const w = 320;
		const h = 200;
		expect(fitScale(w, h)).toBeCloseTo(
			Math.min(SHOWCASE_SCALE.max, (SHOWCASE_BOX.width * SHOWCASE_FILL) / w),
			6,
		);
	});
});
