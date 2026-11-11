import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import { compositionCode } from "../src/lib/composition-code";
import { COMPOSITION_FILES, COMPOSITIONS, compositionsOf } from "../src/visual/compositions";

// Composiciones de ejemplo (design D7, requisito «Composiciones de ejemplo»): cada tipo del Figma tiene la suya.
// La lista sale de la propiedad `Type` del conjunto `Modal` (`4057:415205`) del Figma «Yoruverse UI v8.0», en
// escritorio: 51 tipos (la spec decía 49; vale el Figma).
const FIGMA = {
	Modal: [
		"Horizontal",
		"Warning horizontal",
		"Destructive horizontal",
		"Stacked with team",
		"Stacked with team and link",
		"Stacked with team and invites",
		"Centered photo",
		"Centered photo carousel",
		"Centered video carousel",
		"Stacked left aligned",
		"Warning stacked left aligned",
		"Destructive stacked left aligned",
		"Checkboxes",
		"Access request",
		"Plan 01",
		"File upload",
		"Payment method",
		"Date picker",
		"Payment details",
		"Banner appearance",
		"Payment details with image",
		"Toggles",
		"Link field",
		"Email invite",
		"User invite",
		"Input field",
		"Labels",
		"Dropdown",
		"2FA code",
		"Verification code",
		"Password prompt",
		"Log in",
		"Sign up 02",
		"Sign up 01",
		"Profile settings",
		"Plan 02",
		"User selection",
		"Image crop",
		"Form 01",
		"Form 02",
		"Appearance settings",
		"Calendar event",
		"A.I. assistant",
		"User settings",
		"New project",
		"Text editor",
		"Share project",
		"Create event",
		"Integration",
		"New message (empty state)",
		"New message (filled)",
	],
};

const sourceOf = (component: string) =>
	readFileSync(
		new URL(`../src/visual/examples/${COMPOSITION_FILES[component]}.tsx`, import.meta.url),
		"utf8",
	);

describe("composiciones", () => {
	it("cada tipo del Figma de Modal tiene su composición, sin que falte ni sobre ninguno", () => {
		expect(FIGMA.Modal).toHaveLength(51);
		expect(
			compositionsOf("Modal")
				.map((c) => c.figma)
				.sort(),
		).toEqual([...FIGMA.Modal].sort());
	});

	it("son de un componente del catálogo, con nombre y título únicos, sin ser componentes del catálogo", () => {
		const catalog = catalogComponents();
		for (const c of COMPOSITIONS) {
			expect(catalog, c.name).toContain(c.of);
			expect(catalog, c.name).not.toContain(c.name);
			expect(c.composition).toBe(true);
		}
		expect(new Set(COMPOSITIONS.map((c) => c.name)).size).toBe(COMPOSITIONS.length);
		expect(new Set(COMPOSITIONS.map((c) => c.title)).size).toBe(COMPOSITIONS.length);
	});

	it("el código copiable solo importa de Regula, sin el lienzo de la web ni `contained`", () => {
		for (const c of COMPOSITIONS) {
			const code = compositionCode(sourceOf(c.of), c.name);
			expect(code, c.name).toContain(`export function ${c.name}()`);
			expect(code, c.name).toContain('from "@jotis-me/react"');
			expect(code, c.name).not.toMatch(/Lienzo|\bcontained\b/);
			for (const [, from] of code.matchAll(/from "([^"]+)"/g))
				expect(from, c.name).toMatch(/^@jotis-me\/(react|icons(\/logos)?)$/);
		}
	});

	it("el alto de cada composición es el de su lienzo más el margen de /visual/ (32 px)", () => {
		const src = sourceOf("Modal");
		for (const c of compositionsOf("Modal")) {
			const body = src.slice(src.indexOf(`export function ${c.name}Example()`));
			const own = body.match(/^[\s\S]*?(?:<Lienzo alto=\{(\d+)\}|<(\w+) )/)?.[1];
			const alto = own ?? src.match(/function MensajeNuevo[\s\S]*?<Lienzo alto=\{(\d+)\}/)?.[1];
			expect(c.height, c.name).toBe(Number(alto) + 32);
		}
	});

	it("«Invitar usuarios» es el tipo User invite y su código usa el Modal de @jotis-me/react", () => {
		const c = COMPOSITIONS.find((x) => x.title === "Invitar usuarios");
		expect(c?.figma).toBe("User invite");
		const code = compositionCode(sourceOf("Modal"), c?.name as string);
		expect(code).toMatch(/import \{[^}]*\bModal\b[^}]*\} from "@jotis-me\/react";/);
	});

	it("el código copiable lleva los ayudantes que usa y solo los imports que necesita", () => {
		const code = compositionCode(sourceOf("Modal"), "ModalNewMessageFilled");
		expect(code).toContain("function MensajeNuevo(");
		expect(code).not.toContain("const cancelar");
		expect(code).not.toMatch(/\bCheckbox\b/);
	});
});
