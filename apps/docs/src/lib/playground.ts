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
	 * `{ "@jotis-me/assets/logos": ["SocialGoogleLogo"] }`.
	 */
	imports?: string[] | Record<string, string[]>;
}

export type Control =
	| { kind: "choice"; prop: string; values: string[]; default?: string; coerce?: boolean }
	| { kind: "toggle"; prop: string; default: boolean }
	| { kind: "number"; prop: string; min?: number; max?: number; step?: number; default?: number }
	| { kind: "icon"; prop: string }
	| { kind: "content"; prop: string; options: ContentOption[] }
	/** Un campo de texto, para las props que son un texto libre (`label`, `hint`) y para el texto entre las etiquetas. */
	| { kind: "text"; prop: string };

/** Ajuste de una prop de un componente sobre el control que saldría de su tipo. */
export type Tweak =
	| { kind: "hidden" }
	| { kind: "number"; min?: number; max?: number; step?: number }
	/** Un selector con estos valores, para una prop cuyo tipo es un alias que la tabla no despliega (`ChartLegendPosition`). */
	| { kind: "choice"; values: string[]; coerce?: boolean }
	| { kind: "icon" }
	| { kind: "content"; options: ContentOption[] };

/**
 * Lo que vale cada prop: texto (selectores, iconos y contenido por su etiqueta), booleano o número en los controles; lo
 * que ponga un atajo en las demás (un objeto, por ejemplo). `undefined`: sin valor.
 */
export type State = Record<string, unknown>;

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

/** Un grupo plegable de controles del inspector: su nombre y las props que lleva, en orden. */
export interface Group {
	name: string;
	props: string[];
}

/** Un atajo: un tipo del Figma del componente, con las props que lo definen. Se elige en el desplegable de atajos. */
export interface Shortcut {
	label: string;
	props: Record<string, unknown>;
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
	/** Props incompatibles entre sí. */
	rules?: Rule[];
	/**
	 * Los grupos plegables del inspector (design D3 de redesign-docs-site-v2), en orden: el primero va abierto. Sin
	 * `groups`, un solo grupo «Propiedades» con todos los controles (`groupsOf`, en `./playground-inspector`).
	 */
	groups?: Group[];
	/** Los atajos del desplegable: los tipos del Figma del componente (`./starts/atajos.ts`, generado). */
	shortcuts?: Shortcut[];
	/**
	 * Pares «Esto sí, esto no» de «Cuándo usarlo» y «Evita» (design D3 de redesign-docs-site-v2): el arranque pone los
	 * especímenes y la ficha del componente, el texto. No cruzan a la isla del ejemplo interactivo.
	 */
	examples?: ExamplePair[];
}

/**
 * Un componente pintado en una tarjeta de ejemplo, como datos: su nombre (por defecto, el del arranque), sus props
 * (iconos por su nombre, como en `props`) y su texto. Una prop que recibe un nodo (`actions`) se escribe igual: un
 * espécimen o una lista de ellos.
 */
export interface Specimen {
	component?: string;
	props?: Record<string, unknown>;
	children?: string;
}

/** Un lado de un par: lo que se pinta y la frase de la ficha que lo explica. */
export interface ExampleSide {
	/** Una frase de la ficha del componente, letra a letra (con sus marcas de Markdown): es el pie de la tarjeta. */
	caption: string;
	specimens: Specimen[];
	/** Ancho máximo de los especímenes, en px (campos, estados vacíos). */
	width?: number;
	/** Alto del marco, en px, para lo que llena a su padre (un `Modal` con `contained`). */
	frame?: number;
}

export interface ExamplePair {
	/**
	 * La sección de la página en la que va.
	 * @default "uso"
	 */
	section?: "uso" | "evita";
	do: ExampleSide;
	dont: ExampleSide;
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
]);

/**
 * Props de texto que no se escriben a mano en el ejemplo: clases, identificadores, nombres de formulario, direcciones y
 * valores. Ni ellas ni las que empiezan por `default` o `selected` tienen campo de texto.
 */
const NOT_TEXT = new Set([
	"className",
	"id",
	"name",
	"form",
	"autoComplete",
	"href",
	"src",
	"poster",
	"cover",
	"value",
	"accept",
	"source",
	"color",
	"aria-labelledby",
	"copyAttribute",
	"account",
	"segmentValue",
]);

/** Las props `ReactNode` que suelen ser un texto: tienen campo de texto. Las demás (`actions`, `media`) esperan nodos. */
const TEXT_NODE =
	/^(label|hint|title|subtitle|description|caption|prefix|note|text|quote|supporting|supportingText|tagline|eyebrow)$/;

/** Una prop de texto libre: `string` (salvo las técnicas) o un `ReactNode` que suele ser un texto. */
function isText(row: PropRow, given: unknown): boolean {
	if (given !== undefined && typeof given !== "string") return false;
	if (row.type === "string")
		return !NOT_TEXT.has(row.name) && !/^(default|selected)[A-Z]|Href$/.test(row.name);
	if (row.type !== "ReactNode" && row.type !== "string | ReactNode") return false;
	return TEXT_NODE.test(row.name) || (typeof given === "string" && row.name !== "children");
}

/** Las props de icono. En el ejemplo se escriben con el nombre del componente (`"Plus"`), que cruza como texto. */
const ICON_PROP = /^icon(Leading|Trailing|Only)?$/;

/** Las claves que llevan un icono, también dentro de objetos y listas (`{ icon: "Plus" }`). */
export const ICON_KEY = /^(icon|iconLeading|iconTrailing|iconOnly|trailing)$/;
const ICON_IN_JSON = /"(icon|iconLeading|iconTrailing|iconOnly|trailing)":"([A-Z][A-Za-z0-9]*)"/g;

/** El valor sin las comillas de los iconos: `{"icon":"Plus"}` → `{"icon":Plus}`, que es JSX válido. */
const iconsUnquoted = (json: string) => json.replace(ICON_IN_JSON, '"$1":$2');

/** Los componentes de icono que nombra un valor (en una prop de icono, o dentro de un objeto o lista). */
export function iconNamesIn(prop: string, value: unknown): string[] {
	if (typeof value === "string") return ICON_KEY.test(prop) && /^[A-Z]/.test(value) ? [value] : [];
	if (value === null || typeof value !== "object") return [];
	return [...JSON.stringify(value).matchAll(ICON_IN_JSON)].map((m) => m[2] as string);
}

/** `error` (`string | boolean`) se maneja como contenido preparado: sin error o con un mensaje. */
const ERROR_OPTION: ContentOption = {
	label: "Con error",
	value: "Revisa este campo.",
	code: '"Revisa este campo."',
};

const unquote = (v: string) => v.replace(/^"|"$/g, "");

/** La opción que lleva el valor del punto de partida de una prop de contenido. */
export const DEFAULT_OPTION = "Por defecto";
const same = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b);

/** Un valor como JS para el código copiable: claves sin comillas y los iconos como identificador. */
export function codeOfValue(value: unknown, key = "", indent = 0): string {
	const pad = "\t".repeat(indent + 1);
	const end = "\t".repeat(indent);
	const k = (name: string) => (/^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name));
	if (typeof value === "string")
		return ICON_KEY.test(key) && /^[A-Z]/.test(value) ? value : JSON.stringify(value);
	if (value === null || typeof value !== "object") return JSON.stringify(value);
	const one = Array.isArray(value)
		? `[${value.map((x) => codeOfValue(x, key)).join(", ")}]`
		: `{ ${Object.entries(value)
				.map(([n, x]) => `${k(n)}: ${codeOfValue(x, n)}`)
				.join(", ")} }`;
	if (one.length <= 64) return one;
	if (Array.isArray(value))
		return `[\n${value.map((x) => `${pad}${codeOfValue(x, key, indent + 1)},`).join("\n")}\n${end}]`;
	return `{\n${Object.entries(value)
		.map(([n, x]) => `${pad}${k(n)}: ${codeOfValue(x, n, indent + 1)},`)
		.join("\n")}\n${end}}`;
}

/**
 * Los controles de un componente desde su tabla de props y sus ajustes. Una unión solo da selector si todos sus
 * valores son cadenas; un `number`, un campo numérico; una prop de icono, un selector de icono; el resto de tipos
 * (funciones, nodos, listas) solo tiene control si el ajuste le da contenido preparado.
 */
export function controlsOf(
	rows: PropRow[],
	tweaks: Record<string, Tweak> = {},
	startProps: Record<string, unknown> = {},
	/** El texto entre las etiquetas del punto de partida: con él, hay un campo de texto `children`. */
	children?: string,
): Control[] {
	const controls: Control[] = [];
	// El texto entre las etiquetas, salvo que un ajuste le dé contenido preparado o lo oculte
	if (children !== undefined && !tweaks.children) controls.push({ kind: "text", prop: "children" });
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
			// El valor del punto de partida es la primera opción: sin ella, un control de contenido sin elegir quitaría la prop
			const given = startProps[row.name];
			const options =
				given === undefined || tweak.options.some((o) => same(o.value, given) || o.label === given)
					? tweak.options
					: [{ label: DEFAULT_OPTION, value: given, code: codeOfValue(given) }, ...tweak.options];
			controls.push({ kind: "content", prop: row.name, options });
			continue;
		}
		if (tweak?.kind === "choice") {
			const d = row.defaultValue === undefined ? undefined : unquote(row.defaultValue);
			controls.push({
				kind: "choice",
				prop: row.name,
				values: tweak.values,
				...(tweak.coerce ? { coerce: true } : {}),
				...(d === undefined ? {} : { default: d }),
			});
			continue;
		}
		if (
			tweak?.kind === "icon" ||
			(!tweak &&
				ICON_PROP.test(row.name) &&
				!/^"[^"]*"( · "[^"]*")*$/.test(row.type) &&
				row.type !== "boolean")
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
		// Uniones de literales: textos, `false`, `true` o números (`false | "right" | "bottom"`, `4 · 6`)
		const parts = row.type.split(/ [|·] /);
		const literal = (p: string) => /^"[^"]*"$/.test(p) || /^(false|true|\d+(\.\d+)?)$/.test(p);
		if (!tweak && isText(row, startProps[row.name])) {
			if (!controls.some((c) => c.prop === row.name)) controls.push({ kind: "text", prop: row.name });
			continue;
		}
		if (parts.length > 1 && parts.every(literal))
			controls.push({
				kind: "choice",
				prop: row.name,
				values: parts.map(unquote),
				default: def,
				...(parts.some((p) => !p.startsWith('"')) ? { coerce: true } : {}),
			});
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
				state[c.prop] = c.options.find((o) => same(o.value, given) || o.label === given)?.label;
				break;
			case "text":
				state[c.prop] = isChildrenText(pg, c)
					? pg.start.children
					: typeof given === "string"
						? given
						: undefined;
				break;
		}
	}
	return state;
}

/** El campo de texto del texto entre las etiquetas: no es una prop, lo da `childrenOf`. */
const isChildrenText = (pg: Pick<Playground, "start">, c: Control | undefined) =>
	c?.kind === "text" && c.prop === "children" && pg.start.children !== undefined;

/** El valor de una prop según su control: el de la opción de contenido, el número o el texto; `undefined` si no tiene. */
function resolveValue(c: Control | undefined, value: State[string]): unknown {
	if (value === undefined || value === "") return undefined;
	if (c?.kind === "content") return c.options.find((o) => o.label === value)?.value;
	if (c?.kind === "choice" && c.coerce && typeof value === "string") {
		if (value === "false") return false;
		if (value === "true") return true;
		if (/^\d+(\.\d+)?$/.test(value)) return Number(value);
	}
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
		if (isChildrenText(pg, control)) continue;
		// Un atajo puede vaciar una prop sin control (el `placeholder` del punto de partida)
		if (!control && value === "") {
			delete props[prop];
			continue;
		}
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
	if ("children" in disabledProps(pg, state) || pg.start.children === undefined) return undefined;
	// Con campo de texto, lo que se haya escrito en él
	const typed = pg.controls.some((c) => isChildrenText(pg, c));
	return typed ? (typeof state.children === "string" ? state.children : "") : pg.start.children;
}

/** Cómo se escribe una prop: `prop`, `prop="texto"` o `prop={expresión}`. Si hay código preparado, es el suyo. */
const attr = (prop: string, value: unknown, code?: string) => {
	if (code !== undefined) return `${prop}={${code}}`;
	if (value === true) return prop;
	if (typeof value === "string" && ICON_KEY.test(prop) && /^[A-Z]/.test(value)) return `${prop}={${value}}`;
	if (typeof value === "string" && !/["\n{}]/.test(value)) return `${prop}="${value}"`;
	return `${prop}={${iconsUnquoted(JSON.stringify(value))}}`;
};

const REACT = "@jotis-me/react";
const UNTITLED = "@untitledui/icons";

/** Los imports del código: el componente, los iconos y lo que piden las opciones de contenido elegidas, por módulo. */
export function importsOf(
	pg: Pick<Playground, "name" | "start" | "controls">,
	state: State,
): Record<string, string[]> {
	const out: Record<string, Set<string>> = { [REACT]: new Set([pg.name]) };
	// Los iconos que se pintan, en una prop de icono o dentro de un objeto o una lista
	for (const [prop, value] of Object.entries(propsFor(pg, state)))
		for (const name of iconNamesIn(prop, value)) {
			const set = out[UNTITLED] ?? new Set<string>();
			out[UNTITLED] = set;
			set.add(name);
		}
	for (const c of pg.controls) {
		if (c.kind !== "content") continue;
		const imports = c.options.find((o) => o.label === state[c.prop])?.imports;
		const byModule = Array.isArray(imports) ? { [REACT]: imports } : (imports ?? {});
		for (const [module, names] of Object.entries(byModule)) {
			const set = out[module] ?? new Set<string>();
			out[module] = set;
			for (const name of names) set.add(name);
		}
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
	return jsxLines(pg, state, extra).code;
}

/**
 * El JSX y en qué líneas suyas (desde 1) se escribe cada prop, para marcar las de las props cambiadas. El texto entre
 * las etiquetas va como `children`.
 */
export function jsxLines(
	pg: Pick<Playground, "name" | "start" | "controls">,
	state: State,
	extra = "",
): { code: string; lines: Record<string, number[]> } {
	const byProp = new Map(pg.controls.map((c) => [c.prop, c]));
	const attrs: string[] = extra ? [extra] : [];
	const owners: (string | undefined)[] = extra ? [undefined] : [];
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
		if (
			c?.kind === "choice" &&
			(c.coerce ? String(value) === c.default : value === (c.default ?? undefined))
		)
			continue;
		if (value === undefined) continue;
		// Un `false` solo se escribe si quita un valor por defecto `true`
		if (value === false && !(c?.kind === "toggle" && c.default)) continue;
		const code = c?.kind === "content" ? c.options.find((o) => o.label === state[prop])?.code : undefined;
		attrs.push(attr(prop, value, code));
		owners.push(prop);
	}
	const { name } = pg;
	const children = childCode ?? childrenOf(pg, state);
	const oneLine = `<${[name, ...attrs].join(" ")}`;
	const lines: Record<string, number[]> = {};
	if (oneLine.length + (children?.length ?? 0) <= 72 && !oneLine.includes("\n")) {
		// En una línea: todas las props van en la primera
		for (const prop of owners) if (prop) lines[prop] = [1];
		if (children !== undefined) lines.children = [1];
		return { code: children === undefined ? `${oneLine} />` : `${oneLine}>${children}</${name}>`, lines };
	}
	// Una prop por línea (o por varias, si su valor ocupa más de una)
	let at = 2;
	attrs.forEach((a, i) => {
		const count = a.split("\n").length;
		const prop = owners[i];
		if (prop) lines[prop] = Array.from({ length: count }, (_, k) => at + k);
		at += count;
	});
	const open = `<${name}\n${attrs.map((a) => `\t${a}`).join("\n")}\n`;
	if (children === undefined) return { code: `${open}/>`, lines };
	lines.children = Array.from({ length: children.split("\n").length }, (_, k) => at + 1 + k);
	return { code: `${open}>\n\t${children}\n</${name}>`, lines };
}

/**
 * Código copiable para Next.js y Astro: la importación de @jotis-me/react y el JSX de lo que se ve. `lines` dice en qué
 * líneas de cada versión (desde 1) va cada prop.
 */
export function codeOf(
	pg: Playground,
	state: State,
): {
	next: string;
	astro: string;
	lines: { next: Record<string, number[]>; astro: Record<string, number[]> };
} {
	const imp = Object.entries(importsOf(pg, state))
		.map(([module, names]) => `import { ${names.join(", ")} } from "${module}";`)
		.join("\n");
	const next = jsxLines(pg, state);
	const astro = jsxLines(pg, state, pg.interactive ? "client:load" : "");
	const shift = (lines: Record<string, number[]>, by: number) =>
		Object.fromEntries(Object.entries(lines).map(([prop, ns]) => [prop, ns.map((n) => n + by)]));
	const head = imp.split("\n").length;
	return {
		next: `${imp}\n\n${next.code}`,
		astro: `---\n${imp}\n---\n\n${astro.code}`,
		// Antes del JSX van las importaciones y una línea en blanco; en Astro, además, las dos rayas del frontmatter
		lines: { next: shift(next.lines, head + 1), astro: shift(astro.lines, head + 3) },
	};
}

/** El playground de un componente, o `undefined` si no tiene punto de partida o no hay nada que mover. */
export function playgroundOf(
	name: string,
	rows: PropRow[],
	opts: { interactive: boolean; dark: boolean },
): Playground | undefined {
	// Los pares de ejemplo se pintan en el servidor: no viajan en las props de la isla
	const { examples: _examples, ...start } = STARTS[name] ?? {};
	if (!STARTS[name]) return undefined;
	const controls = controlsOf(rows, start.tweaks, start.props, start.children);
	// Sin controles de las props (los controles de contenido llegan con el módulo del componente) no hay ejemplo
	if (!controls.length && !hasContentTweaks(start)) return undefined;
	return { name, start, controls, ...opts };
}

/** Un componente cuyos controles son solo de contenido preparado (los pone su módulo de cliente). */
const hasContentTweaks = (start: Start) =>
	Object.values(start.tweaks ?? {}).some((x) => x.kind === "content");

/** Puntos de partida de cada componente, repartidos por grupos en `./starts/`. */
export { STARTS };
