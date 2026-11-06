// El bundle del artefacto con React 18 (design D6 y Risks): expone el catálogo en window.Jotis, monta cada ejemplo sin
// errores y la hoja pinta los tokens en claro y en oscuro (`data-theme="dark"`).
import { iconNames } from "@jotis-me/icons";
import { colors } from "@jotis-me/tokens";
import { expect, test } from "@playwright/test";
import { catalogComponents } from "../../../apps/docs/src/lib/catalog";
import { collectErrors, ORIGIN, serve } from "./harness";

const catalog = catalogComponents();
const rgb = (hex: string) => {
	const n = Number.parseInt(hex.slice(1, 7), 16);
	return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

test("con React 18, window.Jotis tiene cada componente del catálogo, sus ejemplos e iconNames", async ({
	page,
}) => {
	const errors = collectErrors(page);
	await serve(page);
	await page.goto(`${ORIGIN}/`);
	const info = await page.evaluate(() => {
		const J = (
			window as unknown as {
				Jotis: Record<string, unknown> & { previews: object; iconNames: string[] };
			}
		).Jotis;
		const R = (window as unknown as { React: { version: string } }).React;
		return {
			react: R.version,
			keys: Object.keys(J),
			previews: Object.keys(J.previews),
			iconNames: J.iconNames,
		};
	});
	expect(info.react).toMatch(/^18\./);
	expect(catalog.filter((n) => !info.keys.includes(n))).toEqual([]);
	expect([...info.previews].sort()).toEqual([...catalog].sort());
	expect(info.iconNames).toEqual([...iconNames]);
	expect(errors).toEqual([]);
});

test("monta el ejemplo de cada componente del catálogo sin errores en consola", async ({ page }) => {
	const errors = collectErrors(page);
	await serve(page);
	await page.goto(`${ORIGIN}/`);
	for (const name of catalog) {
		const rendered = await page.evaluate(async (n) => {
			const w = window as unknown as {
				React: { createElement: (c: unknown) => unknown };
				ReactDOM: {
					createRoot: (el: Element) => { render: (x: unknown) => void; unmount: () => void };
				};
				Jotis: { previews: Record<string, unknown> };
			};
			const el = document.createElement("div");
			document.body.append(el);
			const root = w.ReactDOM.createRoot(el);
			root.render(w.React.createElement(w.Jotis.previews[n]));
			await new Promise((r) => setTimeout(r, 50));
			const ok = el.childElementCount > 0;
			root.unmount();
			el.remove();
			return ok;
		}, name);
		expect(rendered, `${name} no pinta nada`).toBe(true);
	}
	expect(errors).toEqual([]);
});

for (const dark of [false, true]) {
	test(`la hoja pinta el botón primario con bg-brand-solid (${dark ? "oscuro" : "claro"})`, async ({
		page,
	}) => {
		await serve(page, dark);
		await page.goto(`${ORIGIN}/components/Button/preview.html`);
		const bg = await page
			.locator("button")
			.first()
			.evaluate((b) => getComputedStyle(b).backgroundColor);
		expect(bg).toBe(rgb(colors["bg-brand-solid"][dark ? "dark" : "light"]));
	});
}

test("la hoja trae las utilidades propias de los ejemplos (rejilla de AppIcon)", async ({ page }) => {
	await serve(page);
	await page.goto(`${ORIGIN}/components/AppIcon/preview.html`);
	const columns = await page
		.locator(".grid")
		.first()
		.evaluate((g) => getComputedStyle(g).gridTemplateColumns);
	expect(columns).toBe("88px 64px 64px 64px 64px 64px");
});
