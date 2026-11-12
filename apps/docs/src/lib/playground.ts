// Motor del ejemplo interactivo de la página de componente (design D3 de docs-site-with-own-components). De la tabla de
// props (`propsOf`) salen los controles: un selector por prop con valores cerrados, un interruptor por booleano, un
// campo numérico por número y un selector de icono por prop de icono. Los ajustes de cada componente (rango de un
// número, contenido preparado, props ocultas) y su punto de partida se escriben en su `Start`.
import type { PropRow } from "./props";
import { STARTS } from "./starts/index";

/** Un valor de prop que cruza de Astro a la isla. */
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Un valor preparado para una prop que recibe contenido (un nodo, una lista, un objeto) y el JSX que lo escribe. */
export interface ContentOption {
	label: string;
	/** Lo que se le pasa al componente. */
	value: unknown;
	/** Cómo se escribe en el código copiable: `<Avatar initials="AD" />`, `[{ ... }]`. */
	code: string;
	/**
	 * Lo que el código necesita importar además del componente: nombres de @jotis-me/react o, por módulo,
	 * `{ "@jotis-me/icons/logos": ["SocialGoogleLogo"] }`.
	 */
	imports?: string[] | Record<string, string[]>;
}

export type Control =
	| { kind: "choice"; prop: string; values: string[]; default?: string }
	| { kind: "toggle"; prop: string; default: boolean }
	| { kind: "number"; prop: string; min?: number; max?: number; step?: number; default?: number }
	| { kind: "icon"; prop: string }
	| { kind: "content"; prop: string; options: ContentOption[] };

/** Ajuste de una prop de un componente sobre el control que saldría de su tipo. */
export type Tweak =
	| { kind: "hidden" }
	| { kind: "number"; min?: number; max?: number; step?: number }
	| { kind: "icon" }
	| { kind: "content"; options: ContentOption[] };

/**
 * Lo que vale cada prop: texto (selectores, iconos y contenido por su etiqueta), booleano o número en los controles; lo
 * que ponga un atajo en las demás (un objeto, por ejemplo). `undefined`: sin valor.
 */
export type State = Record<string, unknown>;

/** Un atajo: un tipo del Figma, que pone de una vez las props que lo definen. */
export interface Preset {
	label: string;
	/** Las props que pone. Las de un control de contenido, por la etiqueta de su opción. */
	props: Record<string, unknown>;
}

/**
 * Una regla de incompatibilidad: cuando las props actuales cumplen `when`, las de `disable` no aplican. En `when`,
 * `true` es «tiene algún valor», `null` «no tiene valor», una lista es «es uno de estos» y cualquier otro valor, «es igual a».
 */
export interface Rule {
	when: Record<string, unknown>;
	disable: string[];
	/** Props que sí hacen falta cuando la regla aplica (el `label` de un botón de solo icono), salvo que ya valgan algo. */
	set?: Record<string, unknown>;
	/** Por qué no aplican: se muestra bajo el control desactivado y se anuncia. */
	reason: string;
}

export interface Start {
	/** Props mínimas para que el componente se pinte con sentido. */
	props?: Record<string, unknown>;
	/** Texto entre las etiquetas. */
	children?: string;
	/** A todo el ancho del lienzo (lo que mide su contenedor, como StreamScene). */
	wide?: boolean;
	/**
	 * Alto del marco, en px, para los componentes que llenan a su padre (`absolute inset-0`, como BackgroundPattern):
	 * sin él, su padre no mide nada y no se ven. Con marco, el playground no pone su rejilla de fondo.
	 */
	fill?: number;
	/** Ajustes por prop: rango de un número, contenido preparado, props que no se mueven. */
	tweaks?: Record<string, Tweak>;
	/** Atajos con los tipos del Figma del componente. */
	presets?: Preset[];
	/** Props incompatibles entre sí. */
	rules?: Rule[];
}

export interface Playground {
	name: string;
	start: Start;
	controls: Control[];
	interactive: boolean;
	/** Sobre fondo oscuro, como sus ejemplos (Stream). */
	dark: boolean;
}

/**
 * Props que no se mueven desde el playground: las controladas y de estado (abrir, valor, foco, animaciones de
 * entrada y salida) y `contained`, que solo sirve para pintar una capa dentro de una caja.
 */
export const EXCLUDED = new Set([
	"open",
	"defaultOpen",
	"checked",
	"defaultChecked",
	"defaultValue",
	"autoFocus",
	"contained",
	"state",
	"indeterminate",
]);

/** Las props de icono: aceptan el nombre de un icono del núcleo (o un nodo, que el playground no pinta). */
const ICON_PROP = /^icon(Leading|Trailing|Only)?$/;

/** `error` (`string | boolean`) se maneja como contenido preparado: sin error o con un mensaje. */
const ERROR_OPTION: ContentOption = {
	label: "Con error",
	value: "Revisa este campo.",
	code: '"Revisa este campo."',
};

const unquote = (v: string) => v.replace(/^"|"$/g, "");

/**
 * Los controles de un componente desde su tabla de props y sus ajustes. Una unión solo da selector si todos sus
 * valores son cadenas; un `number`, un campo numérico; una prop de icono, un selector de icono; el resto de tipos
 * (funciones, nodos, listas) solo tiene control si el ajuste le da contenido preparado.
 */
export function controlsOf(rows: PropRow[], tweaks: Record<string, Tweak> = {}): Control[] {
	const controls: Control[] = [];
	// `value` es estado cuando el componente avisa de sus cambios; en uno que solo muestra (ProgressBar), es un dato
	const controlled = rows.some((r) => r.name === "onChange");
	for (const row of rows) {
		const tweak = tweaks[row.name];
		// Un ajuste de contenido gana a la exclusión: lo controlado de un componente puede ofrecer valores preparados
		if (!(tweak?.kind === "content") && (EXCLUDED.has(row.name) || (controlled && row.name === "value")))
			continue;
		if (tweak?.kind === "hidden") continue;
		if (!tweak && row.name === "error" && /boolean/.test(row.type)) {
			controls.push({ kind: "content", prop: "error", options: [ERROR_OPTION] });
			continue;
		}
		if (tweak?.kind === "content") {
			controls.push({ kind: "content", prop: row.name, options: tweak.options });
			continue;
		}
		if (
			tweak?.kind === "icon" ||
			(!tweak && (row.type === "IconName" || (ICON_PROP.test(row.name) && /ReactNode/.test(row.type))))
		) {
			controls.push({ kind: "icon", prop: row.name });
			continue;
		}
		const def = row.defaultValue === undefined ? undefined : unquote(row.defaultValue);
		if (row.type === "boolean") {
			controls.push({ kind: "toggle", prop: row.name, default: def === "true" });
			continue;
		}
		if (row.type === "number" || row.type === "string | number") {
			const range = tweak?.kind === "number" ? tweak : {};
			const num = def === undefined || Number.isNaN(Number(def)) ? undefined : Number(def);
			controls.push({
				kind: "number",
				prop: row.name,
				...range,
				...(num === undefined ? {} : { default: num }),
			});
			continue;
		}
		const parts = row.type.split(" · ");
		if (parts.length > 1 && parts.every((p) => /^"[^"]*"$/.test(p)))
			controls.push({ kind: "choice", prop: row.name, values: parts.map(unquote), default: def });
	}
	return controls;
}

/** El valor con el que empieza cada control: el del punto de partida, su valor por defecto o el primero. */
export function initialState(pg: Pick<Playground, "start" | "controls">): State {
	const state: State = {};
	for (const c of pg.controls) {
		const given = pg.start.props?.[c.prop];
		switch (c.kind) {
			case "toggle":
				state[c.prop] = typeof given === "boolean" ? given : c.default;
				break;
			case "choice":
				state[c.prop] = typeof given === "string" ? given : (c.default ?? (c.values[0] as string));
				break;
			case "number":
				state[c.prop] = typeof given === "number" ? given : c.default;
				break;
			case "icon":
				state[c.prop] = typeof given === "string" ? given : undefined;
				break;
			case "content":
				// Empieza en la opción cuyo valor es el del punto de partida, si la hay
				state[c.prop] = c.options.find((o) => o.value === given || o.label === given)?.label;
				break;
		}
	}
	return state;
}

/** El valor de una prop según su control: el de la opción de contenido, el número o el texto; `undefined` si no tiene. */
function resolveValue(c: Control | undefined, value: State[string]): unknown {
	if (value === undefined || value === "") return undefined;
	if (c?.kind === "content") return c.options.find((o) => o.label === value)?.value;
	return value;
}

const has = (v: unknown) => v !== undefined && v !== null && v !== false && v !== "";
const matches = (when: unknown, value: unknown) =>
	when === null
		? !has(value)
		: when === true
			? has(value)
			: Array.isArray(when)
				? when.includes(value)
				: when === value;

/** Las reglas que aplican con lo que valen las props ahora. */
function activeRules(pg: Pick<Playground, "start" | "controls">, state: State): Rule[] {
	const rules = pg.start.rules;
	if (!rules?.length) return [];
	const current = rawProps(pg, state);
	return rules.filter((rule) =>
		Object.entries(rule.when).every(([prop, when]) => matches(when, current[prop])),
	);
}

/** Las props desactivadas por las reglas con lo que valen ahora, y el motivo de cada una. */
export function disabledProps(
	pg: Pick<Playground, "start" | "controls">,
	state: State,
): Record<string, string> {
	const out: Record<string, string> = {};
	for (const rule of activeRules(pg, state))
		for (const prop of rule.disable) out[prop] = out[prop] ? `${out[prop]} ${rule.reason}` : rule.reason;
	return out;
}

/** El punto de partida con el estado encima, sin quitar nada: es lo que miran las reglas. */
function rawProps(pg: Pick<Playground, "start" | "controls">, state: State): Record<string, unknown> {
	const byProp = new Map(pg.controls.map((c) => [c.prop, c]));
	const props: Record<string, unknown> = { ...pg.start.props };
	for (const [prop, value] of Object.entries(state)) {
		const control = byProp.get(prop);
		const v = resolveValue(control, value);
		if (v !== undefined) props[prop] = v;
		// Un control de icono, número o contenido sin valor quita la prop del punto de partida
		else if (control && control.kind !== "toggle" && control.kind !== "choice") delete props[prop];
	}
	return props;
}

/**
 * Las props con las que se pinta: el punto de partida con los controles encima (los sin valor no se pasan), sin las
 * que desactiva alguna regla y con las que esas reglas piden.
 */
export function propsFor(pg: Pick<Playground, "start" | "controls">, state: State): Record<string, unknown> {
	const props = rawProps(pg, state);
	for (const prop of Object.keys(disabledProps(pg, state))) delete props[prop];
	for (const rule of activeRules(pg, state))
		for (const [prop, value] of Object.entries(rule.set ?? {}))
			if (!has(props[prop])) props[prop] = value;
	return props;
}

/** El texto entre las etiquetas, salvo que una regla lo desactive (`children` en su `disable`). */
export function childrenOf(pg: Pick<Playground, "start" | "controls">, state: State): string | undefined {
	return "children" in disabledProps(pg, state) ? undefined : pg.start.children;
}

/** El estado tras elegir un atajo: se parte del inicial, para que no se arrastre lo del atajo anterior. */
export function applyPreset(pg: Pick<Playground, "start" | "controls">, preset: Preset): State {
	return { ...initialState(pg), ...preset.props };
}

/** Un atajo está marcado mientras todas sus props valen lo que él dice (con el punto de partida de fondo). */
export function presetActive(
	pg: Pick<Playground, "start" | "controls">,
	preset: Preset,
	state: State,
): boolean {
	return Object.entries(preset.props).every(([prop, value]) => {
		const now = prop in state ? state[prop] : pg.start.props?.[prop];
		return JSON.stringify(now ?? null) === JSON.stringify(value ?? null);
	});
}

/** Cómo se escribe una prop: `prop`, `prop="texto"` o `prop={expresión}`. Si hay código preparado, es el suyo. */
const attr = (prop: string, value: unknown, code?: string) => {
	if (code !== undefined) return `${prop}={${code}}`;
	if (value === true) return prop;
	if (typeof value === "string" && !/["\n{}]/.test(value)) return `${prop}="${value}"`;
	return `${prop}={${JSON.stringify(value)}}`;
};

const REACT = "@jotis-me/react";

/** Los imports del código: el componente y lo que piden las opciones de contenido elegidas, por módulo. */
export function importsOf(pg: Pick<Playground, "name" | "controls">, state: State): Record<string, string[]> {
	const out: Record<string, Set<string>> = { [REACT]: new Set([pg.name]) };
	for (const c of pg.controls) {
		if (c.kind !== "content") continue;
		const imports = c.options.find((o) => o.label === state[c.prop])?.imports;
		const byModule = Array.isArray(imports) ? { [REACT]: imports } : (imports ?? {});
		for (const [module, names] of Object.entries(byModule))
			for (const name of names) (out[module] ??= new Set()).add(name);
	}
	const sorted = (module: string, names: Set<string>) =>
		[...names].sort((x, y) =>
			module === REACT && x === pg.name
				? -1
				: module === REACT && y === pg.name
					? 1
					: x.localeCompare(y),
		);
	return Object.fromEntries(Object.entries(out).map(([m, names]) => [m, sorted(m, names)]));
}

/**
 * El JSX de lo que se ve: las props del punto de partida y las de los controles que no están en su valor por
 * defecto. Un booleano en `false` sin valor por defecto `true` no se escribe.
 */
export function jsxOf(pg: Pick<Playground, "name" | "start" | "controls">, state: State, extra = ""): string {
	const byProp = new Map(pg.controls.map((c) => [c.prop, c]));
	const attrs: string[] = extra ? [extra] : [];
	// Un control de contenido sobre `children` escribe su código entre las etiquetas, no como atributo
	const childrenControl = byProp.get("children");
	const childCode =
		childrenControl?.kind === "content"
			? childrenControl.options.find((o) => o.label === state.children)?.code
			: undefined;
	for (const [prop, value] of Object.entries(propsFor(pg, state))) {
		const c = byProp.get(prop);
		if (prop === "children" && c?.kind === "content") continue;
		if (c?.kind === "toggle" && value === c.default) continue;
		if (c?.kind === "choice" && value === (c.default ?? undefined)) continue;
		if (value === false || value === undefined) continue;
		const code = c?.kind === "content" ? c.options.find((o) => o.label === state[prop])?.code : undefined;
		attrs.push(attr(prop, value, code));
	}
	const { name } = pg;
	const children = childCode ?? childrenOf(pg, state);
	const oneLine = `<${[name, ...attrs].join(" ")}`;
	const open =
		oneLine.length + (children?.length ?? 0) <= 72
			? oneLine
			: `<${name}\n${attrs.map((a) => `\t${a}`).join("\n")}\n`;
	const multi = open.endsWith("\n");
	if (children === undefined) return `${open}${multi ? "" : " "}/>`;
	return multi ? `${open}>\n\t${children}\n</${name}>` : `${open}>${children}</${name}>`;
}

/** Código copiable para Next.js y Astro: la importación de @jotis-me/react y el JSX de lo que se ve. */
export function codeOf(pg: Playground, state: State): { next: string; astro: string } {
	const imp = Object.entries(importsOf(pg, state))
		.map(([module, names]) => `import { ${names.join(", ")} } from "${module}";`)
		.join("\n");
	return {
		next: `${imp}\n\n${jsxOf(pg, state)}`,
		astro: `---\n${imp}\n---\n\n${jsxOf(pg, state, pg.interactive ? "client:load" : "")}`,
	};
}

/** El playground de un componente, o `undefined` si no tiene punto de partida o no hay nada que mover. */
export function playgroundOf(
	name: string,
	rows: PropRow[],
	opts: { interactive: boolean; dark: boolean },
): Playground | undefined {
	const start = STARTS[name];
	if (!start) return undefined;
	const controls = controlsOf(rows, start.tweaks);
	// Sin controles de las props pero con atajos (los controles de contenido llegan con el módulo del componente)
	if (!controls.length && !start.presets?.length) return undefined;
	return { name, start, controls, ...opts };
}

/** Puntos de partida de cada componente, repartidos por grupos en `./starts/`. */
export { STARTS };
