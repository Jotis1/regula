// Entradas de la búsqueda de la web y cómo se ordenan. Sin dependencias del navegador: se prueba con Vitest.

export type SearchGroup = "pages" | "components" | "tokens" | "icons" | "text";

export interface SearchEntry {
	group: SearchGroup;
	label: string;
	description?: string;
	href: string;
	/** Más texto por el que encontrarla (no se muestra). */
	keywords?: string;
}

/** Orden y nombre de los grupos en el menú. */
export const GROUPS: [SearchGroup, string][] = [
	["pages", "Páginas"],
	["components", "Componentes"],
	["tokens", "Tokens"],
	["icons", "Iconos"],
	["text", "En el texto"],
];

const LIMIT: Record<SearchGroup, number> = { pages: 8, components: 8, tokens: 6, icons: 6, text: 6 };

/** Minúsculas y sin tildes: "tipografia" encuentra "Tipografía". */
export const fold = (s: string) =>
	s
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase();

/** 0 igual · 1 empieza por · 2 contiene (en la etiqueta) · 3 en la descripción o palabras clave · -1 nada. */
function score(entry: SearchEntry, needle: string): number {
	const label = fold(entry.label);
	if (label === needle) return 0;
	if (label.startsWith(needle)) return 1;
	if (label.includes(needle)) return 2;
	if (fold(`${entry.description ?? ""} ${entry.keywords ?? ""}`).includes(needle)) return 3;
	return -1;
}

/**
 * Los grupos que se ven para lo escrito: sin texto, solo las páginas; con texto, las entradas que coinciden,
 * de la mejor a la peor, y los resultados de texto completo (`text`) que no repiten una entrada ya visible.
 */
export function searchGroups(
	entries: SearchEntry[],
	query: string,
	text: SearchEntry[] = [],
): { group: SearchGroup; label: string; entries: SearchEntry[] }[] {
	const needle = fold(query.trim());
	const found = new Map<SearchGroup, SearchEntry[]>();
	if (!needle)
		found.set(
			"pages",
			entries.filter((e) => e.group === "pages"),
		);
	else {
		const ranked = entries
			.map((entry, i) => ({ entry, s: score(entry, needle), i }))
			.filter((r) => r.s >= 0)
			.sort((a, b) => a.s - b.s || a.i - b.i);
		for (const { entry } of ranked) found.set(entry.group, [...(found.get(entry.group) ?? []), entry]);
		const shown = new Set(
			[...found.values()].flatMap((list) =>
				list.slice(0, LIMIT[list[0]?.group ?? "text"]).map((e) => e.href),
			),
		);
		found.set(
			"text",
			text.filter((e) => !shown.has(e.href)),
		);
	}
	return GROUPS.map(([group, label]) => ({
		group,
		label,
		entries: (found.get(group) ?? []).slice(0, LIMIT[group]),
	})).filter((g) => g.entries.length > 0);
}

/** Quita las etiquetas HTML del extracto de Pagefind (`<mark>`) y deja el texto. */
export const plain = (html: string) =>
	html
		.replace(/<[^>]*>/g, "")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, " ")
		.trim();
