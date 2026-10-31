import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { slugOf } from "../src/visual/registry";
import { compare, hasReference, readReference, VIEWPORT_WIDTH } from "./visual/compare";
import { cardHeight, openReference, previewNames } from "./visual/reference";

const MAX_RATIO = 0.02;
const dist = join(import.meta.dirname, "../dist");
const results = join(import.meta.dirname, "../test-results/visual");

test.describe("comparador visual (controles)", () => {
	test("hay referencia en claro y oscuro de todos los componentes de la guía", () => {
		const names = previewNames();
		expect(names).toHaveLength(62);
		expect(names.filter((n) => !hasReference(n))).toEqual([]);
	});

	test("una vista previa vuelve a capturarse igual que su referencia", async ({ page }) => {
		await page.setViewportSize({ width: VIEWPORT_WIDTH, height: cardHeight("Button") });
		await page.emulateMedia({ reducedMotion: "reduce" });
		await openReference(page, "Button", false);
		const shot = await page.screenshot({ animations: "disabled", caret: "hide" });
		expect(compare(shot, readReference("Button", "light")).ratio).toBeLessThan(0.001);
	});

	test("detecta diferencias: claro frente a oscuro y tamaños distintos", () => {
		expect(
			compare(readReference("Button", "light"), readReference("Button", "dark")).ratio,
		).toBeGreaterThan(MAX_RATIO);
		expect(compare(readReference("Button", "light"), readReference("Badge", "light")).sameSize).toBe(
			false,
		);
	});
});

test.describe("paridad visual con la guía", () => {
	for (const name of previewNames()) {
		const built = existsSync(join(dist, "visual", slugOf(name), "index.html"));
		for (const theme of ["light", "dark"] as const) {
			test(`${name} (${theme === "light" ? "claro" : "oscuro"})`, async ({ page }) => {
				test.skip(!built, `${name} aún no está portado`);
				await page.setViewportSize({ width: VIEWPORT_WIDTH, height: cardHeight(name) });
				await page.emulateMedia({ reducedMotion: "reduce" });
				await page.goto(`/visual/${slugOf(name)}/${theme === "dark" ? "?tema=oscuro" : ""}`);
				await page.evaluate(() => document.fonts.ready);
				const shot = await page.screenshot({ animations: "disabled", caret: "hide" });
				const result = compare(shot, readReference(name, theme), results, `${name}-${theme}`);
				expect(result.sameSize, "mismo tamaño que la referencia").toBe(true);
				expect(result.ratio, `píxeles distintos (diff en ${result.diffPath})`).toBeLessThan(
					MAX_RATIO,
				);
			});
		}
	}
});
