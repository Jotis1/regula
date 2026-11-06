import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import { CARD_HEIGHTS, DARK_PREVIEWS, visualExamples } from "../src/visual/registry";

// El registro de ejemplos es la fuente de la tarjeta de cada componente (alto y tema): de él salen las capturas
// aprobadas y las vistas previas del artefacto generado, sin leer la guía.
describe("registro de ejemplos", () => {
	const catalog = [...catalogComponents()].sort();

	it("tiene un ejemplo por componente del catálogo, ni más ni menos", () => {
		expect(Object.keys(visualExamples).sort()).toEqual(catalog);
	});

	it("tiene el alto de la tarjeta de cada componente del catálogo, ni más ni menos", () => {
		expect(Object.keys(CARD_HEIGHTS).sort()).toEqual(catalog);
		for (const [name, h] of Object.entries(CARD_HEIGHTS))
			expect(Number.isInteger(h) && h > 0, `${name}: ${h}`).toBe(true);
	});

	it("solo marca como oscuras vistas previas de componentes del catálogo", () => {
		expect([...DARK_PREVIEWS].filter((n) => !catalog.includes(n))).toEqual([]);
	});
});
