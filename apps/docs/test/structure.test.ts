// La estructura de la web se monta con componentes del paquete (docs-site, «La web sigue el propio sistema»; design D5
// de docs-site-with-own-components): cada pieza importa el componente que le toca y no pinta a mano su etiqueta de
// página (`<header>`, `<footer>`). La navegación lateral es la excepción decidida en 3.2 (NOTAS).
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

/**
 * Sin excepciones desde `redesign-docs-site-v2`: la navegación lateral es `SidebarNav` con `disclosure="native"`, HTML
 * del servidor que funciona sin JavaScript.
 */
const EXEMPT: string[] = [];

/**
 * Piezas interactivas pintadas a mano (etiquetas en minúscula: `<a>`, `<button>`, `<nav>`, `<header>`, `<footer>`)
 * que se aceptan, con su motivo. Cualquier otra hace fallar el test: se usa el componente del paquete o se amplía.
 * Si una desaparece, se quita de aquí para que la lista siga siendo la real.
 */
const HAND_MADE: Record<string, { tag: string; why: string }[]> = {
	"components/SiteHeader.astro": [
		{ tag: "a", why: "«Saltar al contenido», que va delante de HeaderNav (design D5)" },
		{ tag: "a", why: "la marca, que entra en el slot `brand` de HeaderNav" },
	],
	"components/SiteFooter.astro": [],
	"components/MobileMenu.tsx": [
		{ tag: "button", why: "disparador de la búsqueda con aspecto de campo (NOTAS 3.4)" },
	],
	"components/ThemeMenu.tsx": [],
	"search/SiteSearch.tsx": [
		{ tag: "button", why: "disparador de la búsqueda con aspecto de campo (NOTAS 3.4)" },
	],
	"pages/index.astro": [
		{ tag: "button", why: "«Busca lo que te falte», disparador con aspecto de campo (NOTAS 3.4)" },
		{
			tag: "a",
			why: "fila de las cards de móvil con icono y chevron, que LinkCard no tiene (NOTAS 3.4)",
		},
	],
};

const handTags = (code: string) =>
	[...code.matchAll(/<(a|button|nav|header|footer)(?=[\s>/])/g)].map((m) => m[1]).sort();

describe("estructura de la web con componentes del paquete", () => {
	for (const { file, uses } of PIECES)
		it(`${file} usa ${uses} de @jotis-me/react`, () => {
			expect(importsFromPackage(src(file), uses)).toBe(true);
		});

	it("la cabecera y el pie no pintan a mano <header> ni <footer>", () => {
		expect(src("components/SiteHeader.astro")).not.toMatch(/<header[\s>]/);
		expect(src("components/SiteFooter.astro")).not.toMatch(/<footer[\s>]/);
	});

	for (const [file, allowed] of Object.entries(HAND_MADE))
		it(`${file} no pinta navegación ni enlaces a mano fuera de los aceptados`, () => {
			expect(handTags(src(file))).toEqual(allowed.map((h) => h.tag).sort());
		});

	it("la navegación lateral es SidebarNav con submenús nativos, sin isla", () => {
		expect(EXEMPT).toEqual([]);
		const nav = src("components/SideNav.astro");
		expect(nav).toContain("SidebarNav");
		expect(nav).toContain('disclosure="native"');
		expect(nav).not.toMatch(/<SidebarNav[^>]*client:/);
	});
});
