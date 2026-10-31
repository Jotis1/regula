// `prefers-reduced-motion` con CSS real: jsdom no evalúa media queries.
import { expect, test } from "@playwright/test";

const animation = (el: Element) => {
	const s = getComputedStyle(el);
	return { name: s.animationName, duration: s.animationDuration };
};

for (const reduce of [false, true]) {
	test.describe(reduce ? "con menos movimiento" : "con movimiento", () => {
		test.beforeEach(async ({ page }) => {
			await page.emulateMedia({ reducedMotion: reduce ? "reduce" : "no-preference" });
		});

		test(`Skeleton ${reduce ? "no pulsa" : "pulsa cada 1,4 s"}`, async ({ page }) => {
			await page.goto("/visual/skeleton/");
			const block = page.locator('[aria-hidden="true"].bg-tertiary').first();
			const anim = await block.evaluate(animation);
			expect(anim.name).toBe(reduce ? "none" : "pulse");
			if (!reduce) expect(anim.duration).toBe("1.4s");
		});

		test(`Spinner ${reduce ? "gira a 3 s por vuelta" : "gira a 1 s por vuelta"}`, async ({ page }) => {
			await page.goto("/visual/spinner/");
			const svg = page.getByRole("status").first().locator("svg");
			const anim = await svg.evaluate(animation);
			expect(anim.name).toBe("spin");
			expect(anim.duration).toBe(reduce ? "3s" : "1s");
		});
	});
}
