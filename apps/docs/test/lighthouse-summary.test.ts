import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { levelOf, MAX_CLS, summaryOf } from "../scripts/lighthouse-summary";

describe("resumen de Lighthouse (PRF-003)", () => {
	it("una puntuación de rendimiento baja es un aviso, no un error", () => {
		const slowRunner = { performance: 0.82, accessibility: 1, cls: 0.02 };
		expect(levelOf(slowRunner)).toBe("warning");
		expect(summaryOf(slowRunner)).toBe("rendimiento 82, accesibilidad 100, CLS 0.020");
	});

	it("el CLS por encima del límite y la accesibilidad por debajo de 90 son errores", () => {
		expect(levelOf({ performance: 0.99, accessibility: 1, cls: 0.25 })).toBe("error");
		expect(levelOf({ performance: 0.99, accessibility: 0.89, cls: 0 })).toBe("error");
		// En el límite justo, pasa
		expect(levelOf({ performance: 0.9, accessibility: 0.9, cls: MAX_CLS })).toBe("notice");
	});

	it("sin CLS en el informe, deciden las dos puntuaciones", () => {
		expect(levelOf({ performance: 0.95, accessibility: 0.95 })).toBe("notice");
		expect(summaryOf({ performance: 0.95, accessibility: 0.95 })).toBe(
			"rendimiento 95, accesibilidad 95",
		);
	});
});

describe("lighthouserc.json (PRF-003)", () => {
	const config = JSON.parse(readFileSync(join(import.meta.dirname, "../lighthouserc.json"), "utf8")) as {
		ci: { assert: { assertMatrix: { assertions: Record<string, [string, Record<string, unknown>]> }[] } };
	};
	const assertions = config.ci.assert.assertMatrix[0]?.assertions ?? {};

	it("falla por el CLS y por la accesibilidad, y solo avisa del rendimiento", () => {
		expect(assertions["cumulative-layout-shift"]).toEqual(["error", { maxNumericValue: MAX_CLS }]);
		expect(assertions["categories:accessibility"]?.[0]).toBe("error");
		expect(assertions["categories:performance"]?.[0]).toBe("warn");
	});
});
