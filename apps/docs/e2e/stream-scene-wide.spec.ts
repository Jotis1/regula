// StreamScene en 21:9 (cambio add-stream-scene-width): con `width={2580}` y `scale={4/3}` cada variante mide
// 3440×1440, el pie queda a 80 px lógicos de cada borde y el bloque central, centrado. Las capturas aprobadas son de
// tamaño real; para aprobar unas nuevas, `APPROVE_WIDE=1` las escribe en lugar de compararlas.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { approvedPath, compare } from "./visual/compare";

const SCALE = 4 / 3;
// Aparte de las del catálogo (`approved/`), que solo admite una captura por componente y tema
const WIDE_DIR = join(import.meta.dirname, "visual/approved-wide");
const results = join(import.meta.dirname, "../test-results/visual");

for (const variant of ["starting", "brb", "ending", "offline"] as const)
	test(`StreamScene ${variant} a 3440×1440: pie a 80 px de los bordes, bloque centrado y captura aprobada`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 3440, height: 1440 });
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/visual/stream-scene-wide/");
		await page.evaluate(() => document.fonts.ready);
		const scene = page.locator(`[data-scene=${variant}] > *`).first();
		await scene.scrollIntoViewIfNeeded();
		const geometry = await scene.evaluate((el) => {
			const box = (node: Element | null) => {
				const r = (node as Element).getBoundingClientRect();
				return { left: r.left, right: r.right, width: r.width, height: r.height };
			};
			const footer = [...el.querySelectorAll("span")].find(
				(s) => s.textContent === "Tu canal",
			)?.parentElement;
			return {
				scene: box(el),
				footer: box(footer ?? null),
				title: box(el.querySelector("h1")),
			};
		});
		expect(Math.round(geometry.scene.width)).toBe(3440);
		expect(Math.round(geometry.scene.height)).toBe(1440);
		const inset = 80 * SCALE;
		expect(geometry.footer.left - geometry.scene.left).toBeCloseTo(inset, 0);
		expect(geometry.scene.right - geometry.footer.right).toBeCloseTo(inset, 0);
		const center = geometry.scene.left + geometry.scene.width / 2;
		expect(geometry.title.left + geometry.title.width / 2).toBeCloseTo(center, 0);

		const shot = await scene.screenshot({ animations: "disabled", caret: "hide" });
		const name = `StreamSceneWide-${variant}`;
		if (process.env.APPROVE_WIDE) {
			writeFileSync(approvedPath(name, "dark", WIDE_DIR), shot);
			return;
		}
		expect(
			existsSync(approvedPath(name, "dark", WIDE_DIR)),
			`falta la captura aprobada ${name}-dark.png`,
		).toBe(true);
		const result = compare(
			shot,
			readFileSync(approvedPath(name, "dark", WIDE_DIR)),
			results,
			`${name}-dark`,
		);
		expect(result.sameSize, "mismo tamaño que la captura aprobada").toBe(true);
		expect(result.ratio, `píxeles distintos (diff en ${result.diffPath})`).toBeLessThan(0.02);
	});
