// Cada vista previa del artefacto generado frente a la captura aprobada de su componente (design D6), en claro y en
// oscuro y con la misma tolerancia que la suite visual de la web: el artefacto pinta lo mismo que las apps.
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { compare, readApproved, VIEWPORT_WIDTH } from "../../../apps/docs/e2e/visual/compare";
import { catalogComponents } from "../../../apps/docs/src/lib/catalog";
import { CARD_HEIGHTS } from "../../../apps/docs/src/visual/cards";
import { ORIGIN, serve } from "./harness";

const MAX_RATIO = 0.02;
const results = join(import.meta.dirname, "../test-results/previews");

for (const name of catalogComponents()) {
	for (const theme of ["light", "dark"] as const) {
		test(`${name} (${theme === "light" ? "claro" : "oscuro"})`, async ({ page }) => {
			await page.setViewportSize({ width: VIEWPORT_WIDTH, height: CARD_HEIGHTS[name] ?? 300 });
			await page.emulateMedia({ reducedMotion: "reduce" });
			await serve(page, theme === "dark");
			await page.goto(`${ORIGIN}/components/${name}/preview.html`);
			await page.waitForFunction(() => (document.getElementById("root")?.childElementCount ?? 0) > 0);
			await page.evaluate(() => document.fonts.ready);
			const shot = await page.screenshot({ animations: "disabled", caret: "hide" });
			const result = compare(shot, readApproved(name, theme), results, `${name}-${theme}`);
			expect(result.sameSize, "mismo tamaño que la captura aprobada").toBe(true);
			expect(result.ratio, `píxeles distintos (diff en ${result.diffPath})`).toBeLessThan(MAX_RATIO);
		});
	}
}
