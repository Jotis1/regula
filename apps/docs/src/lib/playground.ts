// Playground genérico de la página de componente (design §4). De la tabla de props (`propsOf`) salen los controles:
// un selector por prop con valores cerrados y un interruptor por booleano. Las props mínimas de cada componente,
// su punto de partida, se escriben aquí. Sin punto de partida o sin controles, la página enseña solo sus ejemplos.
// Todo lo que va a la isla es JSON: ni funciones ni nodos.
import type { PropRow } from "./props";

/** Un valor de prop que cruza de Astro a la isla. */
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export type Control =
	| { kind: "choice"; prop: string; values: string[]; default?: string }
	| { kind: "toggle"; prop: string; default: boolean };

export interface Start {
	/** Props mínimas para que el componente se pinte con sentido. */
	props?: Record<string, Json>;
	/** Texto entre las etiquetas. */
	children?: string;
	/** A todo el ancho del lienzo (lo que mide su contenedor, como StreamScene). */
	wide?: boolean;
	/**
	 * Alto del marco, en px, para los componentes que llenan a su padre (`absolute inset-0`, como BackgroundPattern):
	 * sin él, su padre no mide nada y no se ven. Con marco, el playground no pone su rejilla de fondo.
	 */
	fill?: number;
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
	"value",
	"defaultValue",
	"autoFocus",
	"contained",
	"state",
	"indeterminate",
]);

const unquote = (v: string) => v.replace(/^"|"$/g, "");

/**
 * Los controles de un componente desde su tabla de props. Los tipos `IconName`, las funciones, los nodos y los
 * números no dan control; una unión solo lo da si todos sus valores son cadenas.
 */
export function controlsOf(rows: PropRow[]): Control[] {
	const controls: Control[] = [];
	for (const row of rows) {
		if (EXCLUDED.has(row.name)) continue;
		const def = row.defaultValue === undefined ? undefined : unquote(row.defaultValue);
		if (row.type === "boolean") {
			controls.push({ kind: "toggle", prop: row.name, default: def === "true" });
			continue;
		}
		const parts = row.type.split(" · ");
		if (parts.length > 1 && parts.every((p) => /^"[^"]*"$/.test(p)))
			controls.push({ kind: "choice", prop: row.name, values: parts.map(unquote), default: def });
	}
	return controls;
}

/** El valor con el que empieza cada control: el del punto de partida, su valor por defecto o el primero. */
export function initialState(pg: Pick<Playground, "start" | "controls">): Record<string, string | boolean> {
	const state: Record<string, string | boolean> = {};
	for (const c of pg.controls) {
		const given = pg.start.props?.[c.prop];
		if (c.kind === "toggle") state[c.prop] = typeof given === "boolean" ? given : c.default;
		else state[c.prop] = typeof given === "string" ? given : (c.default ?? (c.values[0] as string));
	}
	return state;
}

/** Las props con las que se pinta: el punto de partida con los controles encima. */
export function propsFor(pg: Pick<Playground, "start">, state: Record<string, string | boolean>) {
	return { ...pg.start.props, ...state };
}

const attr = (prop: string, value: Json) => {
	if (value === true) return prop;
	if (typeof value === "string" && !/["\n{}]/.test(value)) return `${prop}="${value}"`;
	return `${prop}={${JSON.stringify(value)}}`;
};

/**
 * El JSX de lo que se ve: las props del punto de partida y las de los controles que no están en su valor por
 * defecto. Un booleano en `false` sin valor por defecto `true` no se escribe.
 */
export function jsxOf(
	pg: Pick<Playground, "name" | "start" | "controls">,
	state: Record<string, string | boolean>,
	extra = "",
): string {
	const byProp = new Map(pg.controls.map((c) => [c.prop, c]));
	const attrs: string[] = extra ? [extra] : [];
	for (const [prop, value] of Object.entries(propsFor(pg, state))) {
		const c = byProp.get(prop);
		if (c && (c.kind === "toggle" ? value === c.default : value === (c.default ?? undefined))) continue;
		if (value === false || value === undefined) continue;
		attrs.push(attr(prop, value));
	}
	const { name } = pg;
	const children = pg.start.children;
	const oneLine = `<${[name, ...attrs].join(" ")}`;
	const open =
		oneLine.length + (children?.length ?? 0) <= 72
			? oneLine
			: `<${name}\n${attrs.map((a) => `\t${a}`).join("\n")}\n`;
	const multi = open.endsWith("\n");
	if (children === undefined) return `${open}${multi ? "" : " "}/>`;
	return multi ? `${open}>\n\t${children}\n</${name}>` : `${open}>${children}</${name}>`;
}

/** Código copiable para Next.js y Astro: la importación de `@jotis-me/react` y el JSX de lo que se ve. */
export function codeOf(
	pg: Playground,
	state: Record<string, string | boolean>,
): { next: string; astro: string } {
	const imp = `import { ${pg.name} } from "@jotis-me/react";`;
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
	const controls = controlsOf(rows);
	if (!controls.length) return undefined;
	return { name, start, controls, ...opts };
}

/** Puntos de partida, con los textos de sus fragmentos de uso (`snippets.ts`). */
export const STARTS: Record<string, Start> = {
	Button: { children: "Nuevo gasto" },
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
	SidebarNav: {
		props: {
			brand: "jotis.me",
			items: [
				{ icon: "home-line", label: "Inicio", href: "#", active: true },
				{ icon: "currency-euro", label: "Pecunia", href: "#", badge: 3 },
			],
		},
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
