import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import { EXAMPLE_FILES } from "../src/visual/example-files";
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

	it("cada ejemplo tiene su fichero en example-files.ts, y ese fichero exporta <Nombre>Example (design D11)", async () => {
		expect(Object.keys(EXAMPLE_FILES).sort()).toEqual(Object.keys(visualExamples).sort());
		for (const [name, file] of Object.entries(EXAMPLE_FILES)) {
			const mod = (await import(`../src/visual/examples/${file}.tsx`)) as Record<string, unknown>;
			expect(mod[`${name}Example`], `${file}.tsx → ${name}Example`).toBe(visualExamples[name]);
		}
	});

	it("la isla VisualExample no importa el registro entero", () => {
		const src = readFileSync(new URL("../src/visual/VisualExample.tsx", import.meta.url), "utf8");
		expect(src).not.toContain('from "./registry"');
		expect(src).not.toContain('from "./examples/');
	});
});
