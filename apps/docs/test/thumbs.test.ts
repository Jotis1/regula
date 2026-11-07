import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import { CARD_HEIGHTS, VIEWPORT_WIDTH } from "../src/visual/cards";
import { THUMBNAILS } from "../src/visual/thumbnails";
import { PREVIEW_BOX, thumbOf } from "../src/visual/thumbs";

describe("respaldo: el ejemplo entero en el escenario", () => {
	it("cabe en el escenario sin pasar de 1 y queda centrado", () => {
		for (const name of catalogComponents()) {
			const { scale, left, top } = thumbOf(name);
			const w = VIEWPORT_WIDTH * scale;
			const h = (CARD_HEIGHTS[name] as number) * scale;
			expect(scale, name).toBeLessThanOrEqual(1);
			expect(w, name).toBeLessThanOrEqual(PREVIEW_BOX.width + 1e-9);
			expect(h, name).toBeLessThanOrEqual(PREVIEW_BOX.height + 1e-9);
			expect(left, name).toBeCloseTo((PREVIEW_BOX.width - w) / 2, 6);
			expect(top, name).toBeCloseTo((PREVIEW_BOX.height - h) / 2, 6);
		}
	});

	it("llena el escenario por el lado más ajustado", () => {
		// Alert: 800×300, manda el ancho (288/800)
		expect(thumbOf("Alert").scale).toBeCloseTo(PREVIEW_BOX.width / VIEWPORT_WIDTH, 10);
	});

	it("un componente sin alto en CARD_HEIGHTS falla con su nombre", () => {
		expect(() => thumbOf("ComponenteInventado")).toThrow(/ComponenteInventado/);
	});
});

describe("muestras de las cards", () => {
	it("la escala de una muestra, si la tiene, es mayor que 0 y menor que 1", () => {
		for (const [name, t] of Object.entries(THUMBNAILS)) {
			if (t.scale === undefined) continue;
			expect(t.scale, name).toBeGreaterThan(0);
			expect(t.scale, name).toBeLessThan(1);
		}
	});

	it("solo hay muestras de componentes del catálogo", () => {
		const catalog = new Set(catalogComponents());
		expect(Object.keys(THUMBNAILS).filter((n) => !catalog.has(n))).toEqual([]);
	});
});
