import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import {
	type ContentOption,
	codeOf,
	controlsOf,
	initialState,
	jsxOf,
	type Playground,
	playgroundOf,
	propsFor,
	STARTS,
	type State,
} from "../src/lib/playground";
import type { PropRow } from "../src/lib/props";
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
	it("Button: selectores de hierarchy y size, interruptores de destructive y loading, y selectores de icono", () => {
		const pg = button();
		expect(pg?.controls.map((c) => `${c.kind}:${c.prop}`)).toEqual([
			"icon:iconLeading",
			"icon:iconTrailing",
			"icon:iconOnly",
			"choice:hierarchy",
			"choice:size",
			"toggle:destructive",
			"toggle:loading",
		]);
		expect(pg?.controls.find((c) => c.prop === "hierarchy")).toMatchObject({
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
			// Los estados extremos de los selectores e interruptores; el resto de controles, como empiezan
			const extreme = (pick: "first" | "last"): State => {
				const out: State = {};
				for (const c of pg.controls) {
					if (c.kind === "toggle") out[c.prop] = pick === "last";
					else if (c.kind === "choice")
						out[c.prop] = pick === "first" ? c.values[0] : c.values.at(-1);
				}
				return out;
			};
			const first = { ...initialState(pg), ...extreme("first") };
			const last = { ...initialState(pg), ...extreme("last") };
			for (const state of [initialState(pg), first, last]) {
				const { next, astro } = codeOf(pg, state);
				expect(next.startsWith(`import { ${name} } from "@jotis-me/react";`), name).toBe(true);
				expect(syntaxErrors(next), `${name}\n${next}`).toEqual([]);
				expect(syntaxErrors(astro.replace(/^---[\s\S]*?---\n/, "")), name).toEqual([]);
			}
		}
		expect(count).toBeGreaterThan(40);
	}, 120_000); // lee los tipos de los 74 con react-docgen-typescript

	it("un number da un campo numérico con su rango y su valor por defecto; la prop que no es de icono no da selector", () => {
		const rows: PropRow[] = [
			{ name: "value", type: "number", required: false, description: "" },
			{ name: "max", type: "number", required: false, defaultValue: "100", description: "" },
			{ name: "iconTrailing", type: "ReactNode", required: false, description: "" },
			{ name: "onClick", type: "() => void", required: false, description: "" },
		];
		expect(controlsOf(rows, { max: { kind: "number", min: 1, step: 5 } })).toEqual([
			{ kind: "number", prop: "value" },
			{ kind: "number", prop: "max", min: 1, step: 5, default: 100 },
			{ kind: "icon", prop: "iconTrailing" },
		]);
	});

	it("un ajuste hidden quita el control y uno de content lo crea aunque el tipo no dé selector", () => {
		const rows: PropRow[] = [
			{ name: "size", type: '"sm" · "md"', required: false, description: "" },
			{ name: "avatar", type: "ReactNode", required: false, description: "" },
		];
		const options: ContentOption[] = [{ label: "Iniciales", value: "AD", code: '"AD"' }];
		expect(
			controlsOf(rows, { size: { kind: "hidden" }, avatar: { kind: "content", options } }).map(
				(c) => c.kind,
			),
		).toEqual(["content"]);
	});

	it("números, iconos y contenido: la prop se pasa con su valor y el código la escribe, con sus imports", () => {
		const options: ContentOption[] = [
			{ label: "Avatar", value: "AVATAR", code: '<Avatar initials="AD" />', imports: ["Avatar"] },
		];
		const pg: Playground = {
			name: "Badge",
			interactive: false,
			dark: false,
			start: { children: "Pagado" },
			controls: [
				{ kind: "number", prop: "count", default: 1 },
				{ kind: "icon", prop: "icon" },
				{ kind: "content", prop: "avatar", options },
			],
		};
		const state: State = { count: 75, icon: "plus", avatar: "Avatar" };
		expect(propsFor(pg, state)).toEqual({ count: 75, icon: "plus", avatar: "AVATAR" });
		const { next } = codeOf(pg, state);
		expect(next).toBe(
			'import { Badge, Avatar } from "@jotis-me/react";\n\n<Badge count={75} icon="plus" avatar={<Avatar initials="AD" />}>Pagado</Badge>',
		);
		expect(syntaxErrors(next)).toEqual([]);
		// Sin icono ni avatar, no se pasan ni se escriben
		const cleared: State = { count: 1, icon: undefined, avatar: undefined };
		expect(propsFor(pg, cleared)).toEqual({ count: 1 });
		expect(codeOf(pg, cleared).next).not.toContain("Avatar");
	});

	it("Skeleton: width es un campo numérico y se escribe como expresión", () => {
		const pg = playgroundOf("Skeleton", rowsOf("Skeleton"), { interactive: false, dark: false });
		if (!pg) throw new Error("Skeleton debería tener playground");
		expect(pg.controls.some((c) => c.kind === "number" && c.prop === "width")).toBe(true);
		const { next } = codeOf(pg, { ...initialState(pg), width: 75 });
		expect(next).toContain("width={75}");
		expect(propsFor(pg, { width: 75 }).width).toBe(75);
	});

	it("value de un componente controlado (con onChange) no tiene control", () => {
		const rows: PropRow[] = [
			{ name: "value", type: "number", required: false, description: "" },
			{ name: "onChange", type: "(v: number) => void", required: false, description: "" },
		];
		expect(controlsOf(rows)).toEqual([]);
	});

	it("cada punto de partida es de un componente que existe", () => {
		const names = new Set(pages.map((p) => p.name));
		expect(Object.keys(STARTS).filter((n) => !names.has(n))).toEqual([]);
	});
});
