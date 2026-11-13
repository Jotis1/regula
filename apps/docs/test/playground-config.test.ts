// Configuración del ejemplo interactivo de cada componente (design D3 de docs-site-with-own-components): todos los del
// catálogo la tienen y lo que dice (punto de partida, atajos, reglas y ajustes) se corresponde con las props reales.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import {
	type Control,
	codeOf,
	controlsOf,
	initialState,
	type Playground,
	propsFor,
	STARTS,
	type Start,
	type State,
	type Tweak,
} from "../src/lib/playground";
import { PLAYGROUND_ICON_NAMES, resolveIcons } from "../src/lib/playground-icons";
import { shortcutState } from "../src/lib/playground-inspector";
import { type PropRow, propsOf } from "../src/lib/props";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const dir = join(root, "apps/docs/src/content/components");
const pages = new Map(
	readdirSync(dir).map((f) => {
		const md = readFileSync(join(dir, f), "utf8");
		const field = (k: string) => md.match(new RegExp(`^${k}: "?([^"\\n]+)"?$`, "m"))?.[1];
		return [
			field("name") as string,
			{ interactive: field("interactive") === "true", source: field("source") },
		] as const;
	}),
);
const rowsOf = (name: string): PropRow[] =>
	propsOf(join(root, pages.get(name)?.source ?? `packages/react/src/components/${name}.tsx`), name);

const catalog = catalogComponents();
const configured = catalog.filter((n) => n in STARTS);
const iconSet = new Set<string>(PLAYGROUND_ICON_NAMES);

/**
 * Los tipos del Figma de cada componente tal como los ofrecían los atajos que se quitaron del ejemplo (change
 * adopt-untitled-ui-icons): lo que ponían tiene que seguir alcanzándose con los controles de propiedades.
 */
const FIGMA_TYPES: Record<string, { label: string; props: Record<string, unknown> }[]> = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/figma-types.json"), "utf8"),
);
/** El estado de un tipo del Figma: sus props sobre el estado inicial, con los valores de contenido por la etiqueta de su opción. */
// Es lo que hace el desplegable de atajos al elegir un tipo (`shortcutState`)
const withType = (pg: Playground, props: Record<string, unknown>): State =>
	shortcutState(pg, { label: "", props });

/** Atributos de HTML que un componente hereda del elemento que pinta y que no salen en su tabla de props. */
const HTML_ATTRS = new Set([
	"placeholder",
	"name",
	"value",
	"defaultValue",
	"id",
	"title",
	"href",
	"alt",
	"src",
	"style",
	"tabIndex",
	"className",
]);

/** Las props que no salen en la tabla de un componente pero que acepta (atributos de HTML, `children`). */
const inherited = (prop: string) => prop === "children" || HTML_ATTRS.has(prop) || /^(aria|data)-/.test(prop);

/** Errores de sintaxis de un fragmento TSX. */
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

/** Por qué un valor no vale para el control de una prop, o `undefined` si vale. */
function invalidValue(c: Control | undefined, value: unknown): string | undefined {
	if (!c) return undefined;
	// «Sin valor» (undefined o null) quita un icono, un número o un contenido; un selector o un interruptor siempre valen algo
	if ((value === undefined || value === null) && c.kind !== "toggle" && c.kind !== "choice")
		return undefined;
	if (c.kind === "choice")
		return (
			c.coerce
				? c.values.includes(String(value))
				: typeof value === "string" && c.values.includes(value)
		)
			? undefined
			: `no es uno de ${c.values.join(", ")}`;
	if (c.kind === "toggle") return typeof value === "boolean" ? undefined : "no es booleano";
	if (c.kind === "number") return typeof value === "number" ? undefined : "no es un número";
	if (c.kind === "icon")
		return typeof value === "string" && iconSet.has(value) ? undefined : "no es un icono del selector";
	if (c.kind === "text") return typeof value === "string" ? undefined : "no es un texto";
	// Un valor de los tipos del Figma es un valor preparado; una cadena, la etiqueta de una opción
	const json = JSON.stringify(value);
	return c.options.some((o) => o.label === value || JSON.stringify(o.value) === json)
		? undefined
		: "no es un valor preparado";
}

type PlaygroundModule = { default: Parameters<typeof createElement>[0]; tweaks?: Record<string, Tweak> };
const built = new Map<string, { pg: Playground; rows: PropRow[]; mod: PlaygroundModule }>();
/** El ejemplo de un componente como lo arma la isla: los controles de su tabla con los ajustes del punto de partida y de su módulo. */
async function playgroundFor(name: string) {
	let b = built.get(name);
	if (!b) {
		const rows = rowsOf(name);
		const start = STARTS[name] as Start;
		const mod = (await import(`../src/playground/${name}.tsx`)) as PlaygroundModule;
		const controls = controlsOf(rows, { ...start.tweaks, ...mod.tweaks }, start.props, start.children);
		const pg: Playground = {
			name,
			start,
			controls,
			interactive: pages.get(name)?.interactive ?? false,
			dark: false,
		};
		b = { pg, rows, mod };
		built.set(name, b);
	}
	return b;
}

describe("configuración del ejemplo interactivo", () => {
	it("todos los componentes del catálogo tienen ejemplo interactivo (punto de partida)", () => {
		expect(catalog.filter((n) => !(n in STARTS))).toEqual([]);
	});

	it("solo hay configuración de componentes del catálogo", () => {
		expect(Object.keys(STARTS).filter((n) => !catalog.includes(n))).toEqual([]);
	});

	it("cada componente configurado tiene al menos un control", async () => {
		for (const name of configured)
			expect((await playgroundFor(name)).pg.controls.length, name).toBeGreaterThan(0);
	}, 180_000);

	it("el punto de partida, las reglas y los ajustes nombran props que existen y con valores válidos", async () => {
		const problems: string[] = [];
		for (const name of configured) {
			const { pg, rows } = await playgroundFor(name);
			const start = STARTS[name];
			const known = new Set(rows.map((r) => r.name));
			const byProp = new Map(pg.controls.map((c) => [c.prop, c]));
			const check = (where: string, prop: string) => {
				if (!known.has(prop) && !inherited(prop))
					problems.push(`${name}: ${where} nombra «${prop}», que no es una prop`);
			};
			for (const prop of Object.keys(start?.props ?? {})) check("el punto de partida", prop);
			for (const prop of Object.keys(start?.tweaks ?? {})) check("un ajuste", prop);
			for (const r of start?.rules ?? []) {
				for (const [prop, value] of Object.entries(r.when)) {
					check(`una regla (when)`, prop);
					const c = byProp.get(prop);
					const values = Array.isArray(value)
						? value
						: value === true || value === null
							? []
							: [value];
					for (const v of values) {
						const bad = invalidValue(c, v);
						if (bad)
							problems.push(
								`${name}: una regla espera ${prop}=${JSON.stringify(v)}, que ${bad}`,
							);
					}
				}
				for (const prop of r.disable) check("una regla (disable)", prop);
				for (const prop of Object.keys(r.set ?? {})) check("una regla (set)", prop);
				if (!r.reason.trim()) problems.push(`${name}: una regla sin motivo`);
			}
		}
		expect(problems).toEqual([]);
	}, 180_000);

	it("los tipos del Figma de cada componente se alcanzan con los controles, con valores válidos", async () => {
		const problems: string[] = [];
		for (const [name, types] of Object.entries(FIGMA_TYPES)) {
			if (!configured.includes(name)) {
				problems.push(`${name}: tiene tipos del Figma pero no ejemplo interactivo`);
				continue;
			}
			const { pg, rows } = await playgroundFor(name);
			const byProp = new Map(pg.controls.map((c) => [c.prop, c]));
			const rowOf = new Map(rows.map((r) => [r.name, r]));
			for (const type of types) {
				for (const [prop, value] of Object.entries(type.props)) {
					const control = byProp.get(prop);
					if (control) {
						const bad = invalidValue(control, value);
						if (bad)
							problems.push(`${name} «${type.label}»: ${prop}=${JSON.stringify(value)} ${bad}`);
						continue;
					}
					// Sin control: solo vale si la prop es texto libre (un `label`, un `placeholder`), no una variante
					const row = rowOf.get(prop);
					const free =
						typeof value === "string" &&
						(inherited(prop) || /^(string|ReactNode|string | ReactNode)$/.test(row?.type ?? ""));
					if (!free)
						problems.push(
							`${name} «${type.label}»: ${prop} no tiene control y no es texto libre`,
						);
				}
			}
		}
		expect(problems).toEqual([]);
	}, 180_000);

	it("cada tipo del Figma pinta sin errores y su código es JSX válido de @jotis-me/react", async () => {
		const problems: string[] = [];
		for (const [name, types] of Object.entries(FIGMA_TYPES)) {
			if (!configured.includes(name)) continue;
			const { pg, mod } = await playgroundFor(name);
			for (const type of types) {
				const state = withType(pg, type.props);
				try {
					renderToStaticMarkup(
						createElement(
							mod.default,
							resolveIcons(propsFor(pg, state)) as object,
							pg.start.children,
						),
					);
				} catch (e) {
					problems.push(`${name} «${type.label}»: ${(e as Error).message}`);
				}
				const { next } = codeOf(pg, state);
				const errors = syntaxErrors(next);
				if (errors.length) problems.push(`${name} «${type.label}»: ${errors.join("; ")}`);
			}
		}
		expect(problems).toEqual([]);
	}, 180_000);

	it("el estado inicial cubre todos los controles de cada componente", async () => {
		for (const name of configured) {
			const { pg } = await playgroundFor(name);
			expect(Object.keys(initialState(pg)).sort(), name).toEqual(pg.controls.map((c) => c.prop).sort());
		}
	}, 180_000);
});
