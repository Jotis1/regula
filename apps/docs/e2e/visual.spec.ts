// Paridad visual: el ejemplo de cada componente en la web frente a su captura aprobada (design D4). Las 74 originales
// se capturaron de la guía; las de un componente nuevo, o las de uno que cambia de aspecto, se aprueban en su PR.
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { catalogComponents } from "../src/lib/catalog";
import { COMPOSITIONS } from "../src/visual/compositions";
import { CARD_HEIGHTS, slugOf } from "../src/visual/registry";
import { compare, hasApproved, missingApproved, readApproved, VIEWPORT_WIDTH } from "./visual/compare";

const MAX_RATIO = 0.02;
// El catálogo y las composiciones (design D7)
const entries = [...catalogComponents(), ...COMPOSITIONS.map((c) => c.name)];
const results = join(import.meta.dirname, "../test-results/visual");
const themes = ["light", "dark"] as const;
const label = { light: "claro", dark: "oscuro" } as const;

test.describe("comparador visual (controles)", () => {
	test("hay captura aprobada en claro y en oscuro de cada componente del catálogo y cada composición", () => {
		expect(missingApproved(entries)).toEqual([]);
	});

	test("si falta una captura, dice qué componente y qué tema", () => {
		const has = (name: string, theme: "light" | "dark") => !(name === "Button" && theme === "dark");
		expect(missingApproved(["Button", "Badge"], has)).toEqual(["Button (oscuro)"]);
	});

	test("detecta diferencias: claro frente a oscuro y tamaños distintos", () => {
		expect(
			compare(readApproved("Button", "light"), readApproved("Button", "dark")).ratio,
		).toBeGreaterThan(MAX_RATIO);
		expect(compare(readApproved("Button", "light"), readApproved("Badge", "light")).sameSize).toBe(false);
	});
});

test.describe("paridad visual con las capturas aprobadas", () => {
	for (const name of entries) {
		for (const theme of themes) {
			test(`${name} (${label[theme]})`, async ({ page }) => {
				test.skip(!hasApproved(name, theme), `${name} no tiene captura aprobada en ${label[theme]}`);
				await page.setViewportSize({ width: VIEWPORT_WIDTH, height: CARD_HEIGHTS[name] ?? 300 });
				await page.emulateMedia({ reducedMotion: "reduce" });
				await page.goto(`/visual/${slugOf(name)}/${theme === "dark" ? "?tema=oscuro" : ""}`);
				await page.evaluate(() => document.fonts.ready);
				const shot = await page.screenshot({ animations: "disabled", caret: "hide" });
				const result = compare(shot, readApproved(name, theme), results, `${name}-${theme}`);
				expect(result.sameSize, "mismo tamaño que la captura aprobada").toBe(true);
				expect(result.ratio, `píxeles distintos (diff en ${result.diffPath})`).toBeLessThan(
					MAX_RATIO,
				);
			});
		}
	}
});
