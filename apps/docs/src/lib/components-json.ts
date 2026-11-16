// The public JSON `/components.json` (spec mcp-server, «Datos públicos en JSON»): every component with its group,
// its card, its props and its Next and Astro snippets. It receives `propsOf` and `snippetsOf` so a test can run it
// without reading the source files; the endpoint passes the real ones.
import { COMPONENT_GROUPS } from "./catalog";
import type { PropRow } from "./props";

export interface ComponentEntry {
	/** File name without extension: the last segment of `/components/<slug>/`. */
	id: string;
	data: {
		name: string;
		description: string;
		interactive: boolean;
		astroNote?: string;
		source?: string;
	};
	/** The card of the guide, as written in the Markdown file. */
	body?: string | undefined;
}

export interface ComponentDeps {
	propsOf: (entry: ComponentEntry) => PropRow[];
	snippetsOf: (name: string, interactive: boolean) => { next: string; astro: string };
}

/** Group of each component name; a test checks every component is in exactly one group. */
function groupOfName(name: string) {
	return COMPONENT_GROUPS.find((g) => g.components.includes(name));
}

export function componentsJson(
	entries: readonly ComponentEntry[],
	deps: ComponentDeps,
	version: string,
	site: string,
) {
	const components = entries
		.map((entry) => {
			const { name, description, interactive, astroNote } = entry.data;
			const group = groupOfName(name);
			const { next, astro } = deps.snippetsOf(name, interactive);
			return {
				name,
				slug: entry.id,
				group: group ? { id: group.id, label: group.label, section: group.section } : null,
				description,
				guide: (entry.body ?? "").trim(),
				interactive,
				astroNote: astroNote ?? null,
				props: deps.propsOf(entry),
				snippets: { next, astro },
				url: new URL(`/components/${entry.id}/`, site).href,
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name, "en"));
	// Groups in the order of the site, so a client can list them as the guide does
	const groups = COMPONENT_GROUPS.map(({ id, label, description, section, components }) => ({
		id,
		label,
		description,
		section,
		components: [...components],
	}));
	return { version, groups, components };
}
