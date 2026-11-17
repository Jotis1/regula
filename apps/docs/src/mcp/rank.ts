// Text search for the tools. Same normalisation and order as the site's search (src/search/entries.ts): no case, no
// accents, and the best match first: equal, starts with, contains in the name, contains elsewhere.
import { fold } from "../lib/fold";

export { fold };

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

export interface Searchable<T> {
	item: T;
	/** What the name is called: an ID, a component or a token name. Each form is compared as written. */
	names: string[];
	/** Everything else the text can match (description, title, usage…). */
	text: string;
}

/** The items matching `query`, best first. A query of several words matches when every word is in the text. */
export function rank<T>(entries: readonly Searchable<T>[], query: string): T[] {
	const needle = fold(query.trim());
	if (!needle) return [];
	const words = needle.split(/\s+/);
	const ranked: { item: T; score: number; index: number }[] = [];
	entries.forEach((entry, index) => {
		const names = entry.names.map(fold);
		let score = -1;
		if (names.includes(needle)) score = 0;
		else if (names.some((n) => n.startsWith(needle))) score = 1;
		else if (names.some((n) => n.includes(needle))) score = 2;
		else {
			const haystack = `${names.join(" ")} ${fold(entry.text)}`;
			if (words.every((w) => haystack.includes(w))) score = 3;
		}
		if (score >= 0) ranked.push({ item: entry.item, score, index });
	});
	return ranked.sort((a, b) => a.score - b.score || a.index - b.index).map((r) => r.item);
}

function distance(a: string, b: string): number {
	let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		const row = [i];
		for (let j = 1; j <= b.length; j++)
			row[j] = Math.min(
				(previous[j] as number) + 1,
				(row[j - 1] as number) + 1,
				(previous[j - 1] as number) + (a[i - 1] === b[j - 1] ? 0 : 1),
			);
		previous = row;
	}
	return previous[b.length] as number;
}

/** The names most like `query`, for an error that helps: `Botón` → `Button`. */
export function closest(query: string, names: readonly string[], count = 5): string[] {
	const needle = fold(query.trim());
	return [...names]
		.map((name) => ({ name, d: distance(needle, fold(name)) }))
		.sort((a, b) => a.d - b.d || a.name.localeCompare(b.name))
		.slice(0, count)
		.map((r) => r.name);
}
