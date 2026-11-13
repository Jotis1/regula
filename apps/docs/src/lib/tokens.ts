// Agrupa los tokens de @jotis-me/tokens para las páginas de fundamentos.
// Todo sale del paquete: un token nuevo aparece en su grupo sin tocar la web.

import { fold } from "../search/entries";
import { contrast, MIN, ratio } from "./contrast";

export interface ThemedToken {
	light: string;
	dark: string;
	usage: string;
}
export interface PlainToken {
	value: string;
	usage: string;
}

export interface ColorRow {
	name: string;
	utility: string;
	light: string;
	dark: string;
	usage: string;
}
export interface ColorGroup {
	title: string;
	rows: ColorRow[];
}

/** Utilidad de Tailwind que expone un token de color. */
export function utilityFor(name: string): string {
	if (name.startsWith("bg-") || name.startsWith("text-") || name.startsWith("border-")) return name;
	if (name.startsWith("fg-")) return `text-${name}`;
	if (name.startsWith("focus-ring")) return `ring-${name}`;
	if (name.startsWith("alpha-")) return `bg-${name.replace(/-(\d+)$/, "/$1")}`;
	return `bg-${name}`;
}

const GROUPS: [string, (name: string) => boolean][] = [
	["Texto", (n) => n.startsWith("text-")],
	["Fondos", (n) => n.startsWith("bg-")],
	["Bordes", (n) => n.startsWith("border-")],
	["Iconos", (n) => n.startsWith("fg-")],
	["Foco", (n) => n.startsWith("focus-ring")],
	["Transparencias", (n) => n.startsWith("alpha-")],
];

/** Colores por grupo: semánticos, escalas utility por tono y, al final, los de componentes. */
export function colorGroups(colors: Record<string, ThemedToken>): ColorGroup[] {
	const groups = new Map<string, ColorRow[]>();
	const push = (title: string, row: ColorRow) => groups.set(title, [...(groups.get(title) ?? []), row]);
	for (const [name, t] of Object.entries(colors)) {
		const row = { name, utility: utilityFor(name), light: t.light, dark: t.dark, usage: t.usage };
		const group = GROUPS.find(([, test]) => test(name))?.[0];
		if (group) push(group, row);
		else if (name.startsWith("utility-")) push(`Utility · ${name.split("-")[1]}`, row);
		else push("Componentes", row);
	}
	const order = [...GROUPS.map(([t]) => t)];
	const rank = (t: string) => (order.includes(t) ? order.indexOf(t) : t.startsWith("Utility") ? 50 : 99);
	return [...groups]
		.map(([title, rows]) => ({ title, rows }))
		.sort((a, b) => rank(a.title) - rank(b.title) || a.title.localeCompare(b.title, "es"));
}

export interface PlainRow {
	name: string;
	value: string;
	usage: string;
	utility?: string;
}

/** Espaciado con su clase numérica de Tailwind (px ÷ 4). */
export function spacingRows(spacing: Record<string, PlainToken>): PlainRow[] {
	return Object.entries(spacing).map(([name, t]) => {
		const px = Number.parseFloat(t.value);
		return {
			name,
			value: t.value,
			usage: t.usage,
			utility: name.startsWith("spacing-") ? `p-${px / 4}` : undefined,
		};
	});
}

export function radiusRows(radius: Record<string, PlainToken>): PlainRow[] {
	return Object.entries(radius).map(([name, t]) => ({
		name,
		value: t.value,
		usage: t.usage,
		utility: `rounded-${name.replace(/^radius-/, "")}`,
	}));
}

export function shadowRows(shadows: Record<string, ThemedToken>): ColorRow[] {
	return Object.entries(shadows).map(([name, t]) => ({
		name,
		utility: name.endsWith("-shadow") ? `shadow-${name.replace(/-shadow$/, "")}` : name,
		light: t.light,
		dark: t.dark,
		usage: t.usage,
	}));
}

/** Familias del explorador de Color (design D6 de redesign-docs-site-v2), en su orden. */
export const COLOR_FAMILIES = [
	["text", "Texto"],
	["bg", "Fondos"],
	["border", "Bordes"],
	["fg", "Iconos"],
	["utility", "Utility"],
	["alpha", "Alfa"],
	["comp", "Componentes"],
] as const;
export type ColorFamily = (typeof COLOR_FAMILIES)[number][0];

/** La familia de un token: por su prefijo, y el resto (foco, avatares, controles…) en Componentes. */
export function colorFamily(name: string): ColorFamily {
	const prefix = name.split("-")[0];
	return (["text", "bg", "border", "fg", "utility", "alpha"] as const).find((f) => f === prefix) ?? "comp";
}

/** Contraste de un token en un tema: «17,9:1» y si queda por debajo del mínimo de WCAG AA. */
export interface TokenRatio {
	label: string;
	low: boolean;
}
export interface ExplorerToken extends ColorRow {
	/** Por lo que se encuentra con el filtro: nombre, utilidad, los dos valores y el uso, sin tildes y en minúsculas. */
	search: string;
	/** Contraste contra el fondo de cada tema. Solo texto e iconos: de un relleno o un borde no se mide. */
	ratios?: { light?: TokenRatio; dark?: TokenRatio };
}
export interface ExplorerFamily {
	id: ColorFamily;
	label: string;
	tokens: ExplorerToken[];
}

/**
 * Los colores del explorador, por familia y en el orden del paquete. El contraste de texto e iconos se mide contra
 * bg-primary de cada tema, salvo los `_on-brand`, que van sobre las secciones de marca (su nota de uso lo dice:
 * «sobre bg-brand-section»): medirlos contra blanco daría un «1:1 · bajo» engañoso.
 */
export function explorerFamilies(colors: Record<string, ThemedToken>): ExplorerFamily[] {
	const groundOf = (name: string) => colors[name.includes("_on-brand") ? "bg-brand-section" : "bg-primary"];
	const tokens = Object.entries(colors).map(([name, t]) => {
		const family = colorFamily(name);
		const kind = family === "text" ? "text" : family === "fg" ? "icon" : undefined;
		const rate = (theme: "light" | "dark"): TokenRatio | undefined => {
			const ground = groundOf(name);
			if (!kind || !ground) return undefined;
			const r = contrast(t[theme], ground[theme]);
			return r === undefined ? undefined : { label: ratio(r), low: r < MIN[kind] };
		};
		const utility = utilityFor(name);
		const token: ExplorerToken = {
			name,
			utility,
			light: t.light,
			dark: t.dark,
			usage: t.usage,
			search: fold(`${name} ${utility} ${t.light} ${t.dark} ${t.usage}`),
			ratios: kind ? { light: rate("light"), dark: rate("dark") } : undefined,
		};
		return { family, token };
	});
	return COLOR_FAMILIES.map(([id, label]) => ({
		id,
		label,
		tokens: tokens.filter((t) => t.family === id).map((t) => t.token),
	}));
}

/**
 * Las secciones que añaden las tablas de tokens al final de una página de fundamentos, con su ancla, para el índice
 * «En esta página»: sus `<h2>` no salen del Markdown y Astro no los cuenta entre los títulos de la página.
 */
export function tokenSections(
	page: string,
	typeGroups: readonly { name: string }[],
): { slug: string; text: string }[] {
	const titles: Record<string, string[]> = {
		typography: typeGroups.map((g) => g.name),
		layout: ["Escala de espaciado", "Radios", "Anchos"],
		states: ["Sombras", "Desenfoques"],
	};
	return (titles[page] ?? []).map((text) => ({
		text,
		slug: `tokens-${text
			.normalize("NFD")
			.replace(/\p{Diacritic}/gu, "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")}`,
	}));
}
