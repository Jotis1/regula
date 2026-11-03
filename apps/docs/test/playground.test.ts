import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { codeOf, controlsOf, initialState, jsxOf, playgroundOf, STARTS } from "../src/lib/playground";
import { propsOf } from "../src/lib/props";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const dir = join(root, "apps/docs/src/content/components");
const pages = readdirSync(dir).map((f) => {
	const md = readFileSync(join(dir, f), "utf8");
	const field = (k: string) => md.match(new RegExp(`^${k}: "?([^"\\n]+)"?$`, "m"))?.[1];
	return {
		name: field("name") as string,
		interactive: field("interactive") === "true",
		source: field("source"),
	};
});
const rowsOf = (name: string, source?: string) =>
	propsOf(join(root, source ?? `packages/react/src/components/${name}.tsx`), name);

/** Errores de sintaxis de un fragmento TSX (lo que vería quien lo pega en un .tsx). */
function syntaxErrors(code: string): string[] {
	const out = ts.transpileModule(code, {
		fileName: "Ejemplo.tsx",
		reportDiagnostics: true,
		compilerOptions: {
			jsx: ts.JsxEmit.Preserve,
			module: ts.ModuleKind.ESNext,
			target: ts.ScriptTarget.ESNext,
		},
	});
	return (out.diagnostics ?? []).map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n"));
}

const button = () => playgroundOf("Button", rowsOf("Button"), { interactive: false, dark: false });

describe("playground", () => {
	it("Button: selectores de hierarchy y size, interruptores de destructive y loading; sin props de icono", () => {
		const pg = button();
		expect(pg?.controls.map((c) => `${c.kind}:${c.prop}`)).toEqual([
			"choice:hierarchy",
			"choice:size",
			"toggle:destructive",
			"toggle:loading",
		]);
		expect(pg?.controls[0]).toMatchObject({
			values: ["primary", "secondary", "tertiary", "link-color", "link-gray"],
			default: "primary",
		});
	});

	it("excluye las props controladas y de estado", () => {
		const props = controlsOf(rowsOf("Modal")).map((c) => c.prop);
		expect(props).not.toContain("open");
		expect(props).not.toContain("contained");
		expect(props).toContain("layout");
	});

	it("el código solo lleva lo que cambia respecto al valor por defecto, y es JSX válido de @jotis-me/react", () => {
		const pg = button();
		if (!pg) throw new Error("Button debería tener playground");
		const state = initialState(pg);
		expect(jsxOf(pg, state)).toBe("<Button>Nuevo gasto</Button>");
		const { next, astro } = codeOf(pg, { ...state, hierarchy: "secondary", loading: true });
		expect(next).toBe(
			'import { Button } from "@jotis-me/react";\n\n<Button hierarchy="secondary" loading>Nuevo gasto</Button>',
		);
		expect(astro).toContain('<Button hierarchy="secondary" loading>');
		expect(syntaxErrors(next)).toEqual([]);
	});

	it("un interactivo lleva client:load en Astro y los datos van como expresiones", () => {
		const pg = playgroundOf("Tabs", rowsOf("Tabs"), { interactive: true, dark: false });
		if (!pg) throw new Error("Tabs debería tener playground");
		const { astro } = codeOf(pg, initialState(pg));
		expect(astro).toMatch(/<Tabs\n\tclient:load\n/);
		expect(astro).toContain('items={[{"id":"resumen"');
	});

	it("en los que tienen playground, el código de cada estado extremo es JSX válido que importa de @jotis-me/react", () => {
		let count = 0;
		for (const { name, interactive, source } of pages) {
			const pg = playgroundOf(name, rowsOf(name, source), { interactive, dark: false });
			if (!pg) continue;
			count++;
			const first = Object.fromEntries(
				pg.controls.map((c) => [c.prop, c.kind === "toggle" ? false : (c.values[0] as string)]),
			);
			const last = Object.fromEntries(
				pg.controls.map((c) => [c.prop, c.kind === "toggle" ? true : (c.values.at(-1) as string)]),
			);
			for (const state of [initialState(pg), first, last]) {
				const { next, astro } = codeOf(pg, state);
				expect(next.startsWith(`import { ${name} } from "@jotis-me/react";`), name).toBe(true);
				expect(syntaxErrors(next), `${name}\n${next}`).toEqual([]);
				expect(syntaxErrors(astro.replace(/^---[\s\S]*?---\n/, "")), name).toEqual([]);
			}
		}
		expect(count).toBeGreaterThan(40);
	}, 120_000); // lee los tipos de los 74 con react-docgen-typescript

	it("cada punto de partida es de un componente que existe", () => {
		const names = new Set(pages.map((p) => p.name));
		expect(Object.keys(STARTS).filter((n) => !names.has(n))).toEqual([]);
	});
});
