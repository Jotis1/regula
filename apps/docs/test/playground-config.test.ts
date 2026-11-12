// Configuración del ejemplo interactivo de cada componente (design D3 de docs-site-with-own-components): todos los del
// catálogo la tienen y lo que dice (punto de partida, atajos, reglas y ajustes) se corresponde con las props reales.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { iconNames } from "@jotis-me/icons";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { catalogComponents } from "../src/lib/catalog";
import {
	applyPreset,
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
import { type PropRow, propsOf } from "../src/lib/props";

/**
 * Componentes del catálogo que aún no tienen configuración: se les da en el grupo 5 de docs-site-with-own-components
 * y esta lista debe quedar vacía al final (tarea 5.7). Quitar un nombre al darle su `Start`.
 */
const PENDING: string[] = [

	"Breadcrumbs", "Pagination", "PaginationDots", "Pager", "Dropdown", "ContextMenu",
	"HeaderNav", "CommandMenu", "TreeView", "Slideout", "Tooltip", "CopyTooltip", "EmptyState", "ProgressBar",
	"ProgressCircle", "ProgressSteps", "AvatarProfilePhoto", "CheckIcon", "CheckItem", "Rating", "RatingBadge", "Kbd",
	"CalendarView", "FilterMenu", "FilterPanel", "ActivityGauge", "RadarChart", "ChartMarker", "SectionFooter",
	"InlineCTA", "LinkCard", "VideoPlayer", "Carousel", "BackgroundOverlay", "TransparencyGrid", "ScaledPreview",
	"ScreenMockup", "LaptopMockup", "PhoneMockup", "MarketingNav", "Footer", "BlogPostCard", "SubscribeCard",
	"PricingCard", "JobPostCard", "Accordion", "TeamMemberCard", "Testimonial", "StreamGoal", "ChannelPanel",
	"ChannelBanner",
]; // biome-ignore format: lista corta por línea

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
const iconSet = new Set<string>(iconNames);

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
	if (c.kind === "choice")
		return typeof value === "string" && c.values.includes(value)
			? undefined
			: `no es uno de ${c.values.join(", ")}`;
	if (c.kind === "toggle") return typeof value === "boolean" ? undefined : "no es booleano";
	if (c.kind === "number") return typeof value === "number" ? undefined : "no es un número";
	if (c.kind === "icon")
		return typeof value === "string" && iconSet.has(value) ? undefined : "no es un icono del núcleo";
	return c.options.some((o) => o.label === value) ? undefined : "no es una opción de contenido";
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
		const controls = controlsOf(rows, { ...start.tweaks, ...mod.tweaks });
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
	it("la lista de pendientes es exactamente la de los componentes del catálogo sin punto de partida", () => {
		expect(catalog.filter((n) => !(n in STARTS)).sort()).toEqual([...PENDING].sort());
	});

	it("solo hay configuración de componentes del catálogo", () => {
		expect(Object.keys(STARTS).filter((n) => !catalog.includes(n))).toEqual([]);
	});

	it("cada componente configurado tiene al menos un control", async () => {
		for (const name of configured)
			expect((await playgroundFor(name)).pg.controls.length, name).toBeGreaterThan(0);
	}, 180_000);

	it("el punto de partida, los atajos, las reglas y los ajustes nombran props que existen y con valores válidos", async () => {
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
			for (const p of start?.presets ?? []) {
				for (const [prop, value] of Object.entries(p.props)) {
					check(`el atajo «${p.label}»`, prop);
					const bad = invalidValue(byProp.get(prop), value);
					if (bad)
						problems.push(
							`${name}: el atajo «${p.label}» pone ${prop}=${JSON.stringify(value)}, que ${bad}`,
						);
				}
			}
			for (const r of start?.rules ?? []) {
				for (const [prop, value] of Object.entries(r.when)) {
					check(`una regla (when)`, prop);
					const c = byProp.get(prop);
					const values = Array.isArray(value) ? value : value === true ? [] : [value];
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

	it("cada atajo pinta sin errores y su código es JSX válido de @jotis-me/react", async () => {
		const problems: string[] = [];
		for (const name of configured) {
			const start = STARTS[name];
			if (!start?.presets?.length) continue;
			const { pg, mod } = await playgroundFor(name);
			for (const preset of start.presets) {
				const state: State = applyPreset(pg, preset);
				try {
					renderToStaticMarkup(
						createElement(mod.default, propsFor(pg, state) as object, pg.start.children),
					);
				} catch (e) {
					problems.push(`${name} «${preset.label}»: ${(e as Error).message}`);
				}
				const { next } = codeOf(pg, state);
				const errors = syntaxErrors(next);
				if (errors.length) problems.push(`${name} «${preset.label}»: ${errors.join("; ")}`);
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
