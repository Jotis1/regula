// Agrupa los tokens de @jotis-me/tokens para las páginas de fundamentos.
// Todo sale del paquete: un token nuevo aparece en su grupo sin tocar la web.

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
