import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import { CARD_HEIGHTS, VIEWPORT_WIDTH } from "../src/visual/cards";
import { PREVIEW_BOX, THUMBS, thumbOf } from "../src/visual/thumbs";

describe("encuadre de la vista previa de las cards", () => {
	it("sin zona, el ejemplo entero cabe en el escenario", () => {
		for (const name of catalogComponents()) {
			if (THUMBS[name]) continue;
			const { zone, scale } = thumbOf(name);
			expect(zone, name).toEqual({ x: 0, y: 0, width: VIEWPORT_WIDTH, height: CARD_HEIGHTS[name] });
			expect(zone.width * scale, name).toBeLessThanOrEqual(PREVIEW_BOX.width + 1e-9);
			expect(zone.height * scale, name).toBeLessThanOrEqual(PREVIEW_BOX.height + 1e-9);
		}
	});

	it("la escala llena el escenario por el lado más ajustado y no pasa de 1", () => {
		// 800×300: manda el ancho (288/800); 800×1000: manda el alto (180/1000)
		const wide = thumbOf("Alert"); // 800×300
		expect(wide.scale).toBeCloseTo(PREVIEW_BOX.width / VIEWPORT_WIDTH, 10);
		expect(wide.zone.width * wide.scale).toBeCloseTo(PREVIEW_BOX.width, 6);
		const tall = Object.entries(CARD_HEIGHTS).find(
			([, h]) => h * (PREVIEW_BOX.width / VIEWPORT_WIDTH) > PREVIEW_BOX.height,
		);
		if (tall) {
			const t = thumbOf(tall[0]);
			expect(t.zone.height * t.scale).toBeCloseTo(PREVIEW_BOX.height, 6);
		}
		for (const name of catalogComponents()) expect(thumbOf(name).scale, name).toBeLessThanOrEqual(1);
	});

	it("una zona pequeña no se agranda más de su tamaño real y queda centrada", () => {
		THUMBS.__prueba = { x: 100, y: 40, width: 100, height: 50 };
		try {
			const t = thumbOf("__prueba");
			// 288/100 = 2,88 y 180/50 = 3,6: sin el tope valdría 2,88, pero no pasa de 1
			expect(t.scale).toBe(1);
			// Centrada: la zona (100×50) en el escenario (288×180), con su esquina en x=100,y=40 del ejemplo
			expect(t.left + 100 * t.scale).toBeCloseTo((PREVIEW_BOX.width - 100) / 2, 6);
			expect(t.top + 40 * t.scale).toBeCloseTo((PREVIEW_BOX.height - 50) / 2, 6);
		} finally {
			delete THUMBS.__prueba;
		}
	});

	it("una zona grande se encoge y el desplazamiento la deja centrada en el escenario", () => {
		THUMBS.__prueba = { x: 50, y: 20, width: 576, height: 200 };
		try {
			const t = thumbOf("__prueba");
			expect(t.scale).toBeCloseTo(0.5, 10); // 288/576
			// Ancho lleno: sin hueco lateral. Alto: 200·0,5 = 100 de 180, centrado
			expect(t.left + 50 * t.scale).toBeCloseTo(0, 6);
			expect(t.top + 20 * t.scale).toBeCloseTo((PREVIEW_BOX.height - 100) / 2, 6);
		} finally {
			delete THUMBS.__prueba;
		}
	});

	it("un componente sin alto en CARD_HEIGHTS falla con su nombre", () => {
		expect(() => thumbOf("ComponenteInventado")).toThrow(/ComponenteInventado/);
	});

	it("todos los componentes del catálogo tienen encuadre", () => {
		for (const name of catalogComponents()) expect(() => thumbOf(name), name).not.toThrow();
	});
});
