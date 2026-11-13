// Geometría del icono de app de la suite: baldosa con esquina, dos letras en curvas y virgulilla.
// Portado de la guía (AppIcon en bundle.js); las letras salen ya en coordenadas absolutas.
import { appicon as data } from "./data.js";

export type AppIconHue =
	| "indigo"
	| "violet"
	| "purple"
	| "fuchsia"
	| "pink"
	| "rose"
	| "orange"
	| "amber"
	| "lime"
	| "green"
	| "emerald"
	| "teal"
	| "cyan"
	| "sky"
	| "blue";
export type AppIconVariant = "default" | "solid" | "light" | "mono";
export type AppIconShape = "rounded" | "square";

export interface AppInfo {
	name: string;
	letters: string;
	hue: AppIconHue;
}

/** Apps de la suite. Para añadir una, pasa la validación de `validateApps`. */
export const apps = data.apps as Record<
	"ornatus" | "vinculum" | "pecunia" | "emptor" | "regula" | "scaena",
	AppInfo
>;
export type AppName = keyof typeof apps;

export const hues = data.hues as Record<
	AppIconHue,
	Record<"50" | "200" | "300" | "500" | "600" | "800" | "950", string>
>;

/** Orden de la paleta de Tailwind (circular): define qué tonos son vecinos. */
const WHEEL = [
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
];
const GRAYS = ["slate", "gray", "zinc", "neutral", "stone"];

/**
 * Comprueba un registro de apps con las reglas de la guía: dos letras, tono de la paleta,
 * nunca rojo (error), amarillo (el blanco no llega a 3:1) ni grises, y sin repetir ni ser vecino de otro.
 * Devuelve la lista de problemas; vacía si el registro es válido.
 */
export function validateApps(
	registry: Record<string, { name: string; letters: string; hue: string }>,
): string[] {
	const problems: string[] = [];
	const entries = Object.entries(registry);
	for (const [id, app] of entries) {
		if (!/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]$/.test(app.letters))
			problems.push(`${id}: las letras deben ser mayúscula + minúscula ("${app.letters}")`);
		if (app.hue === "red") problems.push(`${id}: red está reservado para errores`);
		else if (app.hue === "yellow")
			problems.push(`${id}: yellow no vale, el blanco sobre yellow-600 no llega a 3:1`);
		else if (GRAYS.includes(app.hue))
			problems.push(`${id}: ${app.hue} es gris; la variante mono ya es la gris`);
		else if (!(app.hue in hues)) problems.push(`${id}: ${app.hue} no es un tono de la paleta`);
	}
	for (let i = 0; i < entries.length; i++) {
		for (let j = i + 1; j < entries.length; j++) {
			const [a, x] = entries[i] as [string, AppInfo];
			const [b, y] = entries[j] as [string, AppInfo];
			if (x.letters === y.letters) problems.push(`${a} y ${b} tienen las mismas letras (${x.letters})`);
			if (x.hue === y.hue) problems.push(`${a} y ${b} usan el mismo tono (${x.hue})`);
			const d = Math.abs(WHEEL.indexOf(x.hue) - WHEEL.indexOf(y.hue));
			if (WHEEL.includes(x.hue) && WHEEL.includes(y.hue) && Math.min(d, WHEEL.length - d) === 1)
				problems.push(`${a} (${x.hue}) y ${b} (${y.hue}) tienen tonos vecinos`);
		}
	}
	return problems;
}

export interface AppIconOptions {
	app?: AppName;
	letters?: string;
	hue?: AppIconHue;
	variant?: AppIconVariant;
	/** Tamaño en px: decide la variante por defecto y si se dibuja la virgulilla. */
	size?: number;
	shape?: AppIconShape;
	tilde?: boolean;
	label?: string;
}

export interface AppIconPart {
	d: string;
	fill: string;
	stroke?: string;
	strokeWidth?: number;
	strokeLinecap?: "round";
	vectorEffect?: "non-scaling-stroke";
}

export interface AppIconGeometry {
	label: string;
	parts: AppIconPart[];
}

const VB = 128;
const geo = data.geo;
const glyphs = data.glyphs as unknown as Record<string, [number, string]>;
const kern = data.kern as Record<string, number>;

/** Redondea como la guía: dos decimales, sin ceros a la derecha. */
const n = (v: number) => String(Number(v.toFixed(2)));

function colors(hue: AppIconHue, variant: AppIconVariant) {
	const c = hues[hue] ?? hues.indigo;
	if (variant === "solid") return { bg: c["600"], l1: "#ffffff", l2: "#ffffff" };
	if (variant === "light")
		return { bg: c["50"], l1: c["800"], l2: c["600"], tilde: c["600"], border: c["200"] };
	if (variant === "mono")
		return { bg: data.mono, l1: "#ffffff", l2: data.neutral400, tilde: data.neutral400 };
	return { bg: c["950"], l1: c["300"], l2: c["500"], tilde: c["500"] };
}

/** Aplica `translate(tx ty) scale(k -k)` a un trazo con comandos absolutos M, L, Q, H, V, Z. */
function place(d: string, tx: number, ty: number, k: number): string {
	// Cada segmento es una letra de comando seguida de sus números; los grupos repetidos van implícitos
	return [...d.matchAll(/([MLQHVZ])([^MLQHVZ]*)/g)]
		.map(([, cmd, body]) => {
			const nums = ((body as string).match(/-?\d*\.?\d+/g) ?? []).map(Number);
			const coords = nums.map((v, i) => {
				if (cmd === "H") return n(tx + v * k);
				if (cmd === "V") return n(ty - v * k);
				return i % 2 === 0 ? n(tx + v * k) : n(ty - v * k);
			});
			return `${cmd}${coords.join(" ")}`;
		})
		.join("");
}

function tile(shape: AppIconShape, inset: number): string {
	const S = VB;
	if (shape === "square") return `M0 0H${S}V${S}H0Z`;
	const r = geo.radius * VB - inset;
	const c = geo.corner * VB - inset;
	const o = inset;
	const v = (x: number) => n(x);
	return `M${v(o + r)} ${v(o)}H${v(S - o - r)}A${v(r)} ${v(r)} 0 0 1 ${v(S - o)} ${v(o + r)}V${v(S - o - r)}A${v(r)} ${v(r)} 0 0 1 ${v(S - o - r)} ${v(S - o)}H${v(o + c)}A${v(c)} ${v(c)} 0 0 1 ${v(o)} ${v(S - o - c)}V${v(o + r)}A${v(r)} ${v(r)} 0 0 1 ${v(o + r)} ${v(o)}Z`;
}

/** Calcula las piezas del icono en un lienzo de 128×128. */
export function appIcon(options: AppIconOptions = {}): AppIconGeometry {
	const app = options.app ? apps[options.app] : undefined;
	const letters = String(options.letters ?? app?.letters ?? "Ap").slice(0, 2);
	const hue = options.hue ?? app?.hue ?? "indigo";
	const size = options.size ?? 48;
	const shape = options.shape ?? "rounded";
	const variant = options.variant ?? (size < 20 ? "solid" : "default");
	const col = colors(hue, variant);
	const showTilde = Boolean(col.tilde) && (options.tilde ?? size >= 32);
	const base = (showTilde ? geo.ulBaseline : geo.baseline) * VB;
	const k = (geo.size * VB) / 1000;
	const chars = letters.split("");

	const advances = chars.map(
		(ch, i) => (glyphs[ch]?.[0] ?? 500) + (kern[ch + (chars[i + 1] ?? "")] ?? 0) + geo.track,
	);
	let x = (VB - advances.reduce((a, b) => a + b, 0) * k) / 2;

	const parts: AppIconPart[] = [{ d: tile(shape, 0), fill: col.bg }];
	if (col.border && shape !== "square")
		parts.push({
			d: tile(shape, 0.5),
			fill: "none",
			stroke: col.border,
			vectorEffect: "non-scaling-stroke",
		});
	chars.forEach((ch, i) => {
		const g = glyphs[ch];
		if (g)
			parts.push({
				d: place(g[1], Number(x.toFixed(2)), Number(base.toFixed(2)), k),
				fill: i === 0 ? col.l1 : col.l2,
			});
		x += (advances[i] as number) * k;
	});
	if (showTilde && col.tilde) {
		const T = geo.tilde;
		const w = T.len;
		const x0 = VB / 2 - w / 2;
		const x1 = x0 + w;
		const cx = VB / 2;
		const y = base + T.drop;
		const b = T.amp;
		parts.push({
			d: `M${n(x0)} ${n(y)}C${n(x0 + 0.2 * w)} ${n(y - b)} ${n(x0 + 0.3 * w)} ${n(y - b)} ${n(cx)} ${n(y)}C${n(cx + 0.2 * w)} ${n(y + b)} ${n(x1 - 0.2 * w)} ${n(y + b)} ${n(x1)} ${n(y)}`,
			fill: "none",
			stroke: col.tilde,
			strokeWidth: T.w,
			strokeLinecap: "round",
		});
	}
	return { label: options.label ?? app?.name ?? letters, parts };
}

const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/** El icono como SVG independiente, igual que los de la guía. */
export function appIconSvg(options: AppIconOptions = {}, px = 128): string {
	const { label, parts } = appIcon(options);
	const attrs = (p: AppIconPart) =>
		[
			`fill="${p.fill}"`,
			p.stroke ? `stroke="${p.stroke}"` : "",
			p.strokeWidth ? `stroke-width="${p.strokeWidth}"` : "",
			p.strokeLinecap ? `stroke-linecap="${p.strokeLinecap}"` : "",
			p.vectorEffect ? `vector-effect="${p.vectorEffect}"` : "",
			`d="${p.d}"`,
		]
			.filter(Boolean)
			.join(" ");
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 128 128" role="img"><title>${escapeXml(label)}</title>${parts.map((p) => `<path ${attrs(p)}></path>`).join("")}</svg>`;
}
