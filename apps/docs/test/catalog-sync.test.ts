import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as react from "@jotis-me/react";
import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import { COMPOSITIONS } from "../src/visual/compositions";

// Un solo catálogo (design D5): lo que exporta @jotis-me/react, los grupos de la navegación, las páginas de la web y
// las capturas aprobadas son la misma lista. Añadir un componente sin página, sin grupo o sin captura rompe aquí.

/** Un componente es una exportación en PascalCase que es una función o un objeto de React (forwardRef, memo…). */
function componentsOf(mod: Record<string, unknown>): string[] {
	return Object.entries(mod)
		.filter(
			([name, value]) =>
				/^[A-Z]/.test(name) &&
				(typeof value === "function" ||
					(typeof value === "object" && value !== null && "$$typeof" in value)),
		)
		.map(([name]) => name)
		.sort();
}

const pagesDir = fileURLToPath(new URL("../src/content/components/", import.meta.url));
const pages = readdirSync(pagesDir)
	.filter((f) => f.endsWith(".md"))
	.map((f) => readFileSync(`${pagesDir}${f}`, "utf8").match(/^name:\s*"?([^"\n]+)"?\s*$/m)?.[1] ?? f)
	.sort();

const approvedDir = fileURLToPath(new URL("../e2e/visual/approved/", import.meta.url));
const approved = (theme: "light" | "dark") =>
	readdirSync(approvedDir)
		.filter((f) => f.endsWith(`-${theme}.png`))
		.map((f) => f.slice(0, -`-${theme}.png`.length))
		.sort();

describe("catálogo único", () => {
	const exported = componentsOf(react);

	it("lo que exporta @jotis-me/react son los componentes de los grupos de la navegación", () => {
		expect(exported).toEqual([...catalogComponents()].sort());
	});

	it("cada componente exportado tiene su página, y no hay páginas de más", () => {
		expect(pages).toEqual(exported);
	});

	it("cada componente exportado y cada composición tienen captura aprobada en claro y en oscuro, y no sobra ninguna", () => {
		// Las composiciones (design D7) tienen captura sin ser componentes del paquete
		const expected = [...exported, ...COMPOSITIONS.map((c) => c.name)].sort();
		expect(approved("light")).toEqual(expected);
		expect(approved("dark")).toEqual(expected);
	});

	it("una constante o un contexto en PascalCase no cuenta como componente", () => {
		const fake = {
			Boton,
			Ref: { $$typeof: Symbol.for("react.forward_ref") },
			Tema: {},
			format: () => "",
		};
		expect(componentsOf(fake)).toEqual(["Boton", "Ref"]);
	});
});

/** Componente de prueba para el módulo falso de arriba. */
function Boton() {
	return null;
}
