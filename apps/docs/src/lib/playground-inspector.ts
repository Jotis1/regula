// Lo que el inspector del ejemplo interactivo saca del motor (design D3 de redesign-docs-site-v2): los grupos de
// controles, qué props están cambiadas y cómo se escriben, los atajos y las líneas del código que hay que marcar.
// Sin React ni componentes: lo usan la isla (`components/Playground.tsx`) y los tests.
import {
	type Control,
	codeOfValue,
	disabledProps,
	ICON_KEY,
	initialState,
	type Playground,
	type Shortcut,
	type State,
} from "./playground";

type Pg = Pick<Playground, "start" | "controls">;

/** A partir de cuántos controles el inspector enseña el filtro y un arranque tiene que traer sus grupos. */
export const MANY_CONTROLS = 12;

/** El grupo único de un componente sin `groups`. */
export const DEFAULT_GROUP = "Propiedades";

/** El grupo de los controles que los `groups` del arranque no nombran: el último. */
export const REST_GROUP = "Más props";

export interface ControlGroup {
	name: string;
	controls: Control[];
}

/**
 * Los controles repartidos en los grupos del arranque, en su orden. Un grupo sin controles no sale; los controles que
 * ningún grupo nombra van a «Más props», al final. Sin `groups`, un solo grupo «Propiedades».
 */
export function groupsOf(pg: Pg): ControlGroup[] {
	const groups = pg.start.groups;
	if (!groups?.length) return pg.controls.length ? [{ name: DEFAULT_GROUP, controls: pg.controls }] : [];
	const byProp = new Map(pg.controls.map((c) => [c.prop, c]));
	const used = new Set<string>();
	const out: ControlGroup[] = [];
	for (const group of groups) {
		const controls: Control[] = [];
		for (const prop of group.props) {
			const control = byProp.get(prop);
			if (!control || used.has(prop)) continue;
			used.add(prop);
			controls.push(control);
		}
		if (controls.length) out.push({ name: group.name, controls });
	}
	const rest = pg.controls.filter((c) => !used.has(c.prop));
	if (rest.length) out.push({ name: REST_GROUP, controls: rest });
	return out;
}

/** Los grupos con solo los controles cuyo nombre contiene lo escrito en el filtro, sin distinguir mayúsculas. */
export function filterGroups(groups: ControlGroup[], query: string): ControlGroup[] {
	const q = query.trim().toLowerCase();
	if (!q) return groups;
	return groups
		.map((g) => ({ ...g, controls: g.controls.filter((c) => c.prop.toLowerCase().includes(q)) }))
		.filter((g) => g.controls.length > 0);
}

const empty = (v: unknown) => v === undefined || v === null || v === "";
const same = (a: unknown, b: unknown) =>
	(empty(a) && empty(b)) || a === b || JSON.stringify(a) === JSON.stringify(b);

/** El valor de partida de una prop: el de su control o, sin control (la pone un atajo), el del punto de partida. */
function initialOf(pg: Pg, initial: State, prop: string): unknown {
	return prop in initial ? initial[prop] : pg.start.props?.[prop];
}

/**
 * Las props con un valor distinto del de partida, en el orden de los controles y, tras ellas, las que no tienen control.
 * Una prop desactivada por una regla no cuenta: no se pasa al componente ni sale en el código.
 */
export function changedProps(pg: Pg, state: State): string[] {
	const initial = initialState(pg);
	const off = disabledProps(pg, state);
	const props = [
		...pg.controls.map((c) => c.prop),
		...Object.keys(state).filter((p) => !pg.controls.some((c) => c.prop === p)),
	];
	return props.filter((prop) => !(prop in off) && !same(state[prop], initialOf(pg, initial, prop)));
}

/** El estado con una prop de vuelta en su valor de partida. */
export function resetProp(pg: Pg, state: State, prop: string): State {
	const initial = initialState(pg);
	const next = { ...state };
	if (prop in initial) next[prop] = initial[prop];
	else delete next[prop];
	return next;
}

/** Lo más largo que se escribe una prop cambiada en su etiqueta; lo que pase se corta con puntos suspensivos. */
const CHANGE_MAX = 34;
const cut = (text: string) => {
	const flat = text.replace(/\s+/g, " ");
	return flat.length > CHANGE_MAX ? `${flat.slice(0, CHANGE_MAX - 1).trimEnd()}…` : flat;
};

/**
 * Cómo se escribe en el código una prop cambiada, en corto, para su etiqueta: `size="lg"`, `icon={Mail01}`, `loading`,
 * `striped={false}`. Una prop que se ha quedado sin valor, `sin label`.
 */
export function changeLabel(pg: Pg, state: State, prop: string): string {
	const control = pg.controls.find((c) => c.prop === prop);
	const value = state[prop];
	if (empty(value)) return `sin ${prop}`;
	if (control?.kind === "text" && prop === "children" && pg.start.children !== undefined)
		return cut(`children: ${String(value)}`);
	if (value === true) return prop;
	if (control?.kind === "content") {
		const code = control.options.find((o) => o.label === value)?.code;
		return cut(`${prop}={${code ?? String(value)}}`);
	}
	if (control?.kind === "choice" && control.coerce && /^(true|false|\d+(\.\d+)?)$/.test(String(value)))
		return `${prop}={${String(value)}}`;
	if (typeof value === "string")
		return cut(ICON_KEY.test(prop) && /^[A-Z]/.test(value) ? `${prop}={${value}}` : `${prop}="${value}"`);
	return cut(`${prop}={${codeOfValue(value, prop)}}`);
}

/** El estado al elegir un atajo: sus props sobre los valores de partida, no sobre los actuales. */
export function shortcutState(pg: Pg, shortcut: Shortcut): State {
	const state: State = { ...initialState(pg) };
	for (const [prop, value] of Object.entries(shortcut.props)) {
		const control = pg.controls.find((c) => c.prop === prop);
		if (control?.kind === "content") {
			// Un valor de contenido se guarda por la etiqueta de su opción
			const json = JSON.stringify(value);
			state[prop] = control.options.find(
				(o) => o.label === value || JSON.stringify(o.value) === json,
			)?.label;
		} else if (control?.kind === "choice" && control.coerce) state[prop] = String(value);
		else state[prop] = value;
	}
	return state;
}

/** Un atajo sigue elegido mientras las props que puso no cambien. */
export function shortcutHolds(pg: Pg, state: State, shortcut: Shortcut): boolean {
	const target = shortcutState(pg, shortcut);
	return Object.keys(shortcut.props).every((prop) => same(state[prop], target[prop]));
}

/** Las líneas del código (desde 1) en las que se escriben las props cambiadas, sin repetir y en orden. */
export function highlightOf(lines: Record<string, number[]>, changed: string[]): number[] {
	return [...new Set(changed.flatMap((prop) => lines[prop] ?? []))].sort((a, b) => a - b);
}

/** «Sin cambios», «1 cambio», «3 cambios». */
export const changesText = (n: number) => (n === 0 ? "Sin cambios" : n === 1 ? "1 cambio" : `${n} cambios`);

/** «1 cambiada», «2 cambiadas»: el recuento de un grupo. */
export const groupChangesText = (n: number) => (n === 1 ? "1 cambiada" : `${n} cambiadas`);

/** «1 prop», «4 props». */
export const propsText = (n: number) => (n === 1 ? "1 prop" : `${n} props`);

/** El motivo de un control desactivado, como se enseña en su `hint`: «No aplica: » y el motivo de la regla. */
export const reasonText = (reason: string) =>
	`No aplica: ${reason.charAt(0).toLowerCase()}${reason.slice(1)}`;
