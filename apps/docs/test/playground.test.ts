import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import {
	type ContentOption,
	childrenOf,
	codeOf,
	controlsOf,
	disabledProps,
	initialState,
	jsxOf,
	type Playground,
	playgroundOf,
	propsFor,
	STARTS,
	type State,
} from "../src/lib/playground";
import { resolveIcons } from "../src/lib/playground-icons";
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
		// Con o sin sangrado, según venga de un valor preparado o del arranque: lo que cuenta es que es una expresión
		expect(astro).toMatch(/items=\{\[\s*\{\s*"?id"?:\s*"resumen"/);
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
		const state: State = { count: 75, icon: "Plus", avatar: "Avatar" };
		expect(propsFor(pg, state)).toEqual({ count: 75, icon: "Plus", avatar: "AVATAR" });
		const { next } = codeOf(pg, state);
		expect(next).toBe(
			'import { Badge, Avatar } from "@jotis-me/react";\nimport { Plus } from "@untitledui/icons";\n\n<Badge count={75} icon={Plus} avatar={<Avatar initials="AD" />}>Pagado</Badge>',
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

	it("Button: solo icono desactiva los iconos de los lados y el texto, pide el label y vuelve con su valor al quitarlo", () => {
		const pg = button();
		if (!pg) throw new Error("Button debería tener playground");
		const state: State = { ...initialState(pg), iconLeading: "Plus", iconOnly: "Plus" };
		expect(Object.keys(disabledProps(pg, state))).toEqual(["iconLeading", "iconTrailing", "children"]);
		expect(disabledProps(pg, state).iconLeading).toMatch(/solo icono/i);
		expect(propsFor(pg, state)).toMatchObject({ iconOnly: "Plus", label: "Nuevo gasto" });
		expect(propsFor(pg, state)).not.toHaveProperty("iconLeading");
		expect(childrenOf(pg, state)).toBeUndefined();
		const { next } = codeOf(pg, state);
		expect(next).toContain('<Button iconOnly={Plus} label="Nuevo gasto" />');
		expect(next).toContain('import { Plus } from "@untitledui/icons";');
		expect(next).not.toContain("iconLeading");
		// Sin iconOnly, el icono de la izquierda que había vuelve
		const back: State = { ...state, iconOnly: undefined };
		expect(disabledProps(pg, back)).toEqual({});
		expect(propsFor(pg, back).iconLeading).toBe("Plus");
		expect(childrenOf(pg, back)).toBe("Nuevo gasto");
	});

	it("no hay atajos: los controles de propiedades son la única forma de cambiar el ejemplo", () => {
		const pg = button();
		if (!pg) throw new Error("Button debería tener playground");
		expect(pg.start).not.toHaveProperty("presets");
		for (const [name, start] of Object.entries(STARTS)) expect(start, name).not.toHaveProperty("presets");
	});

	it("los iconos dentro de objetos y listas se escriben como identificador y se importan", () => {
		const pg: Playground = {
			name: "ButtonGroup",
			interactive: false,
			dark: false,
			start: { props: { items: [{ value: "a", label: "A", icon: "Clock" }] } },
			controls: [],
		};
		const { next } = codeOf(pg, {});
		expect(next).toContain('import { Clock } from "@untitledui/icons";');
		expect(next).toContain('"icon":Clock');
		expect(syntaxErrors(next)).toEqual([]);
	});

	it("las props con nombres de icono pasan a componentes, también dentro de objetos y listas, sin tocar fechas", () => {
		const date = new Date(2026, 10, 12);
		const out = resolveIcons({
			iconLeading: "Plus",
			items: [{ icon: "Clock", label: "Clock" }],
			day: date,
		});
		expect(typeof out.iconLeading).toBe("function");
		expect(typeof out.items[0]?.icon).toBe("function");
		expect(out.items[0]?.label).toBe("Clock");
		expect(out.day).toBe(date);
	});

	it("un selector con false o números convierte el texto al valor y no escribe el valor por defecto", () => {
		const rows: PropRow[] = [
			{ name: "digits", type: "4 · 6", required: false, defaultValue: "6", description: "" },
			{
				name: "legend",
				type: 'false | "bottom" | "right"',
				required: false,
				defaultValue: "false",
				description: "",
			},
		];
		const controls = controlsOf(rows);
		expect(controls).toMatchObject([
			{ kind: "choice", prop: "digits", values: ["4", "6"], coerce: true, default: "6" },
			{
				kind: "choice",
				prop: "legend",
				values: ["false", "bottom", "right"],
				coerce: true,
				default: "false",
			},
		]);
		const pg: Playground = { name: "X", interactive: false, dark: false, start: {}, controls };
		expect(propsFor(pg, { digits: "4", legend: "false" })).toEqual({ digits: 4, legend: false });
		expect(codeOf(pg, { digits: "4", legend: "right" }).next).toContain(
			'<X digits={4} legend="right" />',
		);
	});

	it("cada punto de partida es de un componente que existe", () => {
		const names = new Set(pages.map((p) => p.name));
		expect(Object.keys(STARTS).filter((n) => !names.has(n))).toEqual([]);
	});
});
