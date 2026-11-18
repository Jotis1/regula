// CodeSnippet: una línea destacada cubre todo el ancho que se desplaza, también si es más larga que el bloque.
import { expect, hydrated, test } from "./hydration";

test("Línea destacada larga: el destacado llega de borde a borde del área que se desplaza", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto("/components/input/");
	const pg = page.locator("section[aria-labelledby=ejemplo]");
	await pg.scrollIntoViewIfNeeded();
	await hydrated(pg.locator("astro-island").first());
	const hint = pg.locator('[data-playground-controls] [data-prop="hint"]');
	const group = hint.locator("xpath=ancestor::details[1]");
	if (!(await group.evaluate((d) => (d as HTMLDetailsElement).open)))
		await group.locator("> summary").click();
	await hint
		.locator("input, textarea")
		.first()
		.fill(
			"Una pista muy larga que no cabe de ninguna manera en el ancho del bloque de código del ejemplo",
		);
	const pre = pg.locator("[data-playground-code] pre").first();
	await expect(pre.getByText("línea destacada")).toHaveCount(1);
	const m = await pre.evaluate((el) => {
		const hl = [...el.querySelectorAll("code > span")].find((s) =>
			s.textContent?.includes("Una pista muy larga"),
		) as HTMLElement;
		el.scrollLeft = el.scrollWidth;
		const box = el.getBoundingClientRect();
		const r = hl.getBoundingClientRect();
		return {
			left: r.left - box.left + el.scrollLeft,
			right: r.right - box.left + el.scrollLeft,
			scrollWidth: el.scrollWidth,
			overflows: el.scrollWidth > el.clientWidth,
		};
	});
	expect(m.overflows).toBe(true);
	expect(m.left).toBeLessThanOrEqual(1);
	expect(m.right).toBeGreaterThanOrEqual(m.scrollWidth - 1);
});
