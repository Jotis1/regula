// La estructura de la web se monta con componentes del paquete (docs-site, «La web sigue el propio sistema»; design D5
// de docs-site-with-own-components): cada pieza importa el componente que le toca y no pinta a mano su etiqueta de
// página (`<header>`, `<footer>`). La navegación lateral es la excepción pendiente de decisión (NOTAS, 3.2).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const src = (file: string) => readFileSync(join(import.meta.dirname, "../src", file), "utf8");
const importsFromPackage = (code: string, name: string) =>
	[...code.matchAll(/import\s*\{([^}]*)\}\s*from\s*"@jotis-me\/react"/g)].some((m) =>
		(m[1] ?? "").split(",").some((n) => n.trim() === name),
	);

const PIECES: { file: string; uses: string }[] = [
	{ file: "components/SiteHeader.astro", uses: "HeaderNav" },
	{ file: "components/SiteFooter.astro", uses: "Footer" },
	{ file: "components/MobileMenu.tsx", uses: "Slideout" },
	{ file: "components/ThemeMenu.tsx", uses: "Dropdown" },
	{ file: "search/SiteSearch.tsx", uses: "CommandMenu" },
	{ file: "pages/index.astro", uses: "LinkCard" },
];

/** Pendiente de decisión (3.2): `SidebarNav` no cubre la navegación sin JavaScript. Si se decide ampliarlo, se quita de aquí. */
const EXEMPT = ["components/SideNav.astro"];

describe("estructura de la web con componentes del paquete", () => {
	for (const { file, uses } of PIECES)
		it(`${file} usa ${uses} de @jotis-me/react`, () => {
			expect(importsFromPackage(src(file), uses)).toBe(true);
		});

	it("la cabecera y el pie no pintan a mano <header> ni <footer>", () => {
		expect(src("components/SiteHeader.astro")).not.toMatch(/<header[\s>]/);
		expect(src("components/SiteFooter.astro")).not.toMatch(/<footer[\s>]/);
	});

	it("la única pieza de estructura sin componente del paquete es la navegación lateral", () => {
		expect(EXEMPT).toEqual(["components/SideNav.astro"]);
		expect(src("components/SideNav.astro")).not.toContain("SidebarNav");
	});
});
