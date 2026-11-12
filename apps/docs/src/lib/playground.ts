// Motor del ejemplo interactivo de la página de componente (design D3 de docs-site-with-own-components). De la tabla de
// props (`propsOf`) salen los controles: un selector por prop con valores cerrados, un interruptor por booleano, un
// campo numérico por número y un selector de icono por prop de icono. Los ajustes de cada componente (rango de un
// número, contenido preparado, props ocultas) y su punto de partida se escriben en su `Start`.
import type { PropRow } from "./props";

/** Un valor de prop que cruza de Astro a la isla. */
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Un valor preparado para una prop que recibe contenido (un nodo, una lista, un objeto) y el JSX que lo escribe. */
export interface ContentOption {
	label: string;
	/** Lo que se le pasa al componente. */
	value: unknown;
	/** Cómo se escribe en el código copiable: `<Avatar initials="AD" />`, `[{ ... }]`. */
	code: string;
	/** Componentes de @jotis-me/react que el código necesita importar. */
	imports?: string[];
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
 * `true` es «tiene algún valor», una lista es «es uno de estos» y cualquier otro valor, «es igual a».
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
		if (EXCLUDED.has(row.name) || (controlled && row.name === "value")) continue;
		const tweak = tweaks[row.name];
		if (tweak?.kind === "hidden") continue;
		if (tweak?.kind === "content") {
			controls.push({ kind: "content", prop: row.name, options: tweak.options });
			continue;
		}
		if (
			tweak?.kind === "icon" ||
			(!tweak && ICON_PROP.test(row.name) && /IconName|ReactNode/.test(row.type))
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
				state[c.prop] = c.options.find((o) => o.value === given)?.label;
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
	when === true ? has(value) : Array.isArray(when) ? when.includes(value) : when === value;

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

/** Imports de @jotis-me/react que piden las opciones de contenido elegidas. */
export function importsOf(pg: Pick<Playground, "name" | "controls">, state: State): string[] {
	const names = new Set([pg.name]);
	for (const c of pg.controls)
		if (c.kind === "content")
			for (const i of c.options.find((o) => o.label === state[c.prop])?.imports ?? []) names.add(i);
	return [...names].sort((a, b) => (a === pg.name ? -1 : b === pg.name ? 1 : a.localeCompare(b)));
}

/**
 * El JSX de lo que se ve: las props del punto de partida y las de los controles que no están en su valor por
 * defecto. Un booleano en `false` sin valor por defecto `true` no se escribe.
 */
export function jsxOf(pg: Pick<Playground, "name" | "start" | "controls">, state: State, extra = ""): string {
	const byProp = new Map(pg.controls.map((c) => [c.prop, c]));
	const attrs: string[] = extra ? [extra] : [];
	for (const [prop, value] of Object.entries(propsFor(pg, state))) {
		const c = byProp.get(prop);
		if (c?.kind === "toggle" && value === c.default) continue;
		if (c?.kind === "choice" && value === (c.default ?? undefined)) continue;
		if (value === false || value === undefined) continue;
		const code = c?.kind === "content" ? c.options.find((o) => o.label === state[prop])?.code : undefined;
		attrs.push(attr(prop, value, code));
	}
	const { name } = pg;
	const children = childrenOf(pg, state);
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
	const imp = `import { ${importsOf(pg, state).join(", ")} } from "@jotis-me/react";`;
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
	if (!controls.length) return undefined;
	return { name, start, controls, ...opts };
}

/** Puntos de partida, con los textos de sus fragmentos de uso (`snippets.ts`). */
export const STARTS: Record<string, Start> = {
	Button: {
		children: "Nuevo gasto",
		presets: [
			{ label: "Primario", props: { hierarchy: "primary" } },
			{ label: "Secundario", props: { hierarchy: "secondary" } },
			{ label: "Terciario", props: { hierarchy: "tertiary" } },
			{ label: "Destructivo", props: { hierarchy: "primary", destructive: true } },
			{ label: "Con icono", props: { iconLeading: "plus" } },
			{ label: "Solo icono", props: { iconOnly: "plus" } },
			{ label: "Cargando", props: { loading: true } },
		],
		rules: [
			{
				when: { iconOnly: true },
				disable: ["iconLeading", "iconTrailing", "children"],
				set: { label: "Nuevo gasto" },
				reason: "Un botón de solo icono no lleva texto ni iconos a los lados.",
			},
		],
	},
	Badge: { children: "Pagado" },
	BadgeGroup: { props: { badge: "Nuevo", href: "#" }, children: "Hemos publicado los estados vacíos" },
	Tag: { children: "Facturas" },
	Avatar: { props: { initials: "AD", alt: "Administrador" } },
	AvatarGroup: { props: { items: [{ initials: "AB" }, { initials: "CD" }, { initials: "+3" }] } },
	AvatarLabel: {
		props: { initials: "AD", name: "Responsable de seguridad", supporting: "admin@jotis.me" },
	},
	FeaturedIcon: { props: { icon: "alert-circle" } },
	Spinner: { props: { label: "Importando extracto…" } },
	Skeleton: { props: { width: 160, height: 40 } },
	AppIcon: { props: { app: "regula", size: 64 } },
	Icon: { props: { name: "refresh-cw-01", size: 24 } },
	ButtonUtility: { props: { icon: "copy-01", label: "Copiar" } },
	HelpIcon: { props: { title: "Qué incluye", text: "Impuestos incluidos, sin descuentos." } },
	Input: { props: { label: "Correo", type: "email", placeholder: "tu@jotis.me" } },
	NumberInput: { props: { label: "Invitados", defaultValue: 2, min: 1, max: 12 } },
	TagInput: { props: { label: "Etiquetas", defaultValue: ["diseño", "código"] } },
	VerificationCodeInput: { props: { label: "Código de verificación" } },
	Textarea: { props: { label: "Descripción", hint: "Máximo 300 caracteres." } },
	Select: { props: { label: "Categoría", placeholder: "Elige una", options: ["Casa", "Coche", "Ocio"] } },
	MultiSelect: {
		props: {
			label: "Equipos",
			placeholder: "Elige equipos",
			options: ["Ingeniería", "Diseño", "Producto", "Márketing"],
		},
	},
	Checkbox: { props: { label: "Recordarme", hint: "Mantén la sesión 30 días." } },
	Radio: { props: { name: "plan", value: "mensual", label: "Mensual" } },
	RadioGroup: {
		props: {
			"aria-label": "Plan",
			options: [
				{ value: "mensual", label: "Mensual" },
				{ value: "anual", label: "Anual", hint: "Dos meses gratis" },
			],
		},
	},
	Toggle: { props: { label: "Avisos por correo" } },
	FileUpload: { props: { accept: ".csv", hint: "CSV (máx. 10 MB)" } },
	DatePicker: { props: { inline: true } },
	MessageInput: { props: { placeholder: "Pregunta a Emptor…" } },
	TextEditor: { props: { label: "Notas", maxLength: 500 } },
	Tabs: {
		props: {
			"aria-label": "Secciones",
			items: [
				{ id: "resumen", label: "Resumen" },
				{ id: "movimientos", label: "Movimientos", count: 12 },
			],
		},
	},
	// La marca (el icono de Regula) la pone `src/playground/SidebarNav.tsx`: los nodos no cruzan a la isla.
	// Con submenú, secciones, pie y cuenta, cada `type` se ve distinto: `dual-tier` y `slim` abren el panel de Panel.
	SidebarNav: {
		props: {
			search: true,
			items: [
				{ icon: "home-line", label: "Inicio", href: "#" },
				{
					icon: "bar-chart-01",
					label: "Panel",
					defaultOpen: true,
					children: [
						{ icon: "eye", label: "Resumen", href: "#", active: true },
						{ icon: "bell-01", label: "Avisos", href: "#", badge: 10 },
						{ icon: "star-01", label: "Guardados", href: "#" },
						{ icon: "clock", label: "Programados", href: "#" },
					],
				},
				{ icon: "currency-euro", label: "Pecunia", href: "#", badge: 3 },
				{ icon: "users-01", label: "Equipo", href: "#" },
			],
			sections: [
				{
					title: "General",
					items: [
						{ icon: "home-line", label: "Inicio", href: "#" },
						{ icon: "bar-chart-01", label: "Panel", href: "#", active: true },
					],
				},
				{
					title: "Apps",
					items: [
						{ icon: "currency-euro", label: "Pecunia", href: "#", badge: 3 },
						{
							icon: "folder",
							label: "Carpetas",
							defaultOpen: true,
							children: [
								{ label: "Recientes", href: "#", badge: 8 },
								{ label: "Compartidas", href: "#", badge: 4 },
							],
						},
					],
				},
			],
			footerItems: [{ icon: "settings-02", label: "Ajustes", href: "#" }],
			account: {
				items: [{ icon: "user-01", label: "Ver perfil" }],
				accounts: [
					{
						value: "ana",
						name: "Ana Díaz",
						email: "ana@jotis.me",
						initials: "AD",
						status: "online",
					},
					{ value: "luis", name: "Luis Gil", email: "luis@jotis.me", initials: "LG" },
				],
			},
		},
		fill: 760,
	},
	FilterBar: {
		props: {
			segments: [
				{ value: "todo", label: "Todo" },
				{ value: "gastos", label: "Gastos" },
			],
			defaultSegment: "todo",
		},
		wide: true,
	},
	Modal: {
		props: {
			open: true,
			contained: true,
			icon: "trash-01",
			title: "¿Eliminar este gasto?",
			description: "Se borrará también de los informes. No se puede deshacer.",
		},
		// `contained` llena a su padre (`absolute inset-0`): sin marco, su padre no mide nada y el diálogo se encoge
		fill: 360,
	},
	Alert: {
		props: { title: "No se pudo sincronizar", description: "Revisa la conexión con el banco." },
		wide: true,
	},
	Notification: {
		props: { title: "Pago registrado", description: "Has añadido 42,50 € a Suscripciones." },
	},
	Banner: {
		props: {
			icon: "zap",
			title: "Nueva versión de Pecunia.",
			description: "Ahora con presupuestos compartidos.",
		},
		wide: true,
	},
	Table: {
		props: {
			title: "Movimientos",
			count: "240",
			columns: [
				{ key: "concepto", label: "Concepto", primary: true },
				{ key: "fecha", label: "Fecha" },
				{ key: "importe", label: "Importe", align: "right" },
			],
			rows: [{ id: "1", concepto: "Alquiler", fecha: "01 oct", importe: "650,00 €" }],
		},
		wide: true,
	},
	MetricCard: {
		props: { label: "Gasto del mes", value: "1.284 €", change: "12%", period: "vs. septiembre" },
	},
	ActivityFeed: {
		props: {
			items: [
				{
					author: "Ana Martín",
					avatar: { initials: "AM" },
					time: "Hace 2 h",
					text: "Ha pagado el alquiler",
				},
				{
					author: "Luis Gil",
					avatar: { initials: "LG" },
					time: "Ayer",
					text: "Ha añadido una factura",
				},
			],
		},
	},
	Message: {
		props: { author: "Emptor", avatar: { initials: "Em" }, time: "10:24" },
		children: "He encontrado tres opciones por debajo de 200 €.",
	},
	CodeSnippet: { props: { language: "bash", code: "bun add @jotis-me/react" }, wide: true },
	PageHeader: {
		props: { title: "Gastos", description: "Controla lo que entra y lo que sale." },
		wide: true,
	},
	CardHeader: {
		props: { title: "Suscripciones", badge: "12 activas", description: "Pagos recurrentes de este mes." },
		wide: true,
	},
	SectionHeader: {
		props: { title: "Contactos", description: "Personas y empresas con las que tratas." },
		wide: true,
	},
	SectionLabel: {
		props: {
			title: "Equipo",
			help: "Quién puede ver y editar el proyecto.",
			description: "Gestiona quién entra y con qué permisos.",
		},
	},
	ContentDivider: { props: { label: "o continúa con" }, wide: true },
	BackgroundPattern: { props: { width: 480, height: 200 }, fill: 200 },
	BrowserFrame: { props: { url: "pecunia.jotis.me/resumen", height: 200 }, wide: true },
	CreditCard: { props: { company: "Pecunia", holder: "Administrador", expiry: "06/29", last4: "4821" } },
	LineChart: {
		props: {
			"aria-label": "Gastos de agosto a octubre",
			labels: ["Ago", "Sep", "Oct"],
			series: [
				{ name: "Gastos", data: [1240, 1060, 1284] },
				{ name: "Presupuesto", data: [1100, 1200, 1200] },
			],
		},
		wide: true,
	},
	BarChart: {
		props: {
			"aria-label": "Gasto por categoría y mes",
			labels: ["Ago", "Sep", "Oct"],
			series: [
				{ name: "Hogar", data: [700, 700, 700] },
				{ name: "Ocio", data: [190, 170, 210] },
			],
		},
		wide: true,
	},
	PieChart: {
		props: {
			"aria-label": "Gasto de octubre por categoría",
			center: "1.284 €",
			data: [
				{ name: "Hogar", value: 700 },
				{ name: "Ocio", value: 210 },
				{ name: "Otros", value: 374 },
			],
		},
	},
	ChartLegend: { props: { series: [{ name: "Gastos" }, { name: "Presupuesto" }] } },
	StreamAlert: { props: { user: "TioBigotes", amount: 1284 } },
	StreamEvents: {
		props: {
			items: [
				{ id: 2, type: "donation", user: "Marta_en_Directo", amount: 5, time: "2 min" },
				{ id: 1, type: "raid", user: "TioBigotes", amount: 1284, time: "9 min" },
			],
		},
	},
	StreamStatus: { props: { viewers: 1284, uptime: "2:14:05", category: "Just Chatting" } },
	ChatBadge: {},
	ChatBox: {
		props: {
			messages: [
				{ id: 1, user: "TioBigotes", tone: "sky", badges: ["mod"], text: "Bienvenidos todos." },
				{
					id: 2,
					user: "lucia_pixel",
					tone: "pink",
					badges: ["sub"],
					text: "Esa jugada la he visto yo.",
				},
			],
		},
	},
	CamFrame: { props: { width: 360, name: "Tu canal", role: "ella/él" } },
	NowPlaying: {
		props: { title: "Cuatro paredes y un techo", artist: "Los Vecinos del Quinto", progress: 0.42 },
	},
	StreamCountdown: { props: { seconds: 600, label: "Empezamos en" } },
	StreamScene: { props: { variant: "brb", seconds: 480, countdownLabel: "Vuelvo en" }, wide: true },
};
