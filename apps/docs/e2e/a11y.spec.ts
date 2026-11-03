import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Todas las páginas construidas de la web (sin las de comparación visual, que no son navegables)
const dist = join(import.meta.dirname, "../dist");
function pages(dir: string): string[] {
	return readdirSync(dir).flatMap((f) => {
		const p = join(dir, f);
		if (statSync(p).isDirectory()) return f === "visual" || f === "_astro" ? [] : pages(p);
		return f === "index.html" ? [`/${relative(dist, dir).split(sep).join("/")}/`.replace("//", "/")] : [];
	});
}

// Excepciones de contraste que documenta la guía (GUIA.md, «Contraste»): `text-success-primary` (3,2:1) y
// `text-warning-primary` (2,9:1) sobre blanco valen junto a un icono. Solo se perdonan si el texto lleva su icono.
const ICON_EXCEPTIONS = [".text-success-primary", ".text-warning-primary"];
async function documentedContrastException(page: Page, rule: string, target: string): Promise<boolean> {
	if (rule !== "color-contrast") return false;
	return page
		.locator(target)
		.evaluate(
			(el, classes) => classes.some((c) => el.matches(c)) && !!el.querySelector("svg"),
			ICON_EXCEPTIONS,
		);
}

for (const path of pages(dist)) {
	for (const dark of [false, true]) {
		test(`${path} sin fallos de accesibilidad serios (${dark ? "oscuro" : "claro"})`, async ({
			page,
		}) => {
			await page.emulateMedia({ colorScheme: dark ? "dark" : "light" });
			await page.goto(path);
			await expect(page.locator("html")).toHaveClass(dark ? /dark-mode/ : /^(?!.*dark-mode)/);
			// Las islas a la vista se hidratan nada más cargar: si axe pasa a la vez, ve el DOM a medio cambiar
			// (ids de React Aria y etiquetas que aún no están). Las de fuera de la vista siguen con su HTML de servidor.
			await page.waitForFunction(() =>
				// `astro-island` es `display: contents` (su caja mide 0): se mira la de sus hijos
				[...document.querySelectorAll("astro-island[ssr]")].every((island) =>
					[...island.children].every((child) => {
						const r = child.getBoundingClientRect();
						return r.height === 0 || r.top > innerHeight || r.bottom < 0;
					}),
				),
			);
			const result = await new AxeBuilder({ page }).analyze();
			for (const v of result.violations) {
				const keep = [];
				for (const n of v.nodes)
					if (!(await documentedContrastException(page, v.id, n.target.join(" ")))) keep.push(n);
				v.nodes = keep;
			}
			const serious = result.violations
				.filter((v) => v.nodes.length && (v.impact === "serious" || v.impact === "critical"))
				.map(
					(v) =>
						`${v.id}: ${v.nodes
							.slice(0, 3)
							.map((n) => n.target.join(" "))
							.join(", ")}`,
				);
			expect(serious).toEqual([]);
		});
	}
}

// A 390px aparecen cajas que se desplazan en horizontal (tablas, ejemplos anchos) que en escritorio caben: cada una
// tiene que poder enfocarse para desplazarla con el teclado. Solo esta regla, que es la que depende del ancho.
for (const path of pages(dist))
	test(`${path} a 390px: lo que se desplaza se puede enfocar`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(path);
		const { violations } = await new AxeBuilder({ page })
			.withRules(["scrollable-region-focusable"])
			.analyze();
		expect(violations.flatMap((v) => v.nodes.map((n) => n.target.join(" ")))).toEqual([]);
	});
