// The tools of the MCP server (spec mcp-server). Each one is a pure function of the loaded data and its arguments, so
// the tests run them without a server. Names, parameters and descriptions are in English; the texts they return are
// the guide's, in Spanish, and every result carries the URL of its page.
import { z } from "zod";
import { kebab } from "../lib/gallery";
import { GALLERIES } from "../lib/icons-json";
import { TOKEN_CATEGORIES } from "../lib/tokens-json";
import type { RegulaData } from "./data";
import { closest, DEFAULT_LIMIT, fold, MAX_LIMIT, rank } from "./rank";

export interface ToolResult {
	text: string;
	isError?: boolean;
}

export interface Tool {
	name: string;
	title: string;
	description: string;
	inputSchema: z.ZodRawShape;
	/** `args` already went through `inputSchema`. */
	run: (data: RegulaData, args: Record<string, unknown>) => ToolResult;
}

/** Keeps the arguments typed from the schema; the server validates them before `run` is called. */
function defineTool<S extends z.ZodRawShape>(def: {
	name: string;
	title: string;
	description: string;
	inputSchema: S;
	run: (data: RegulaData, args: z.output<z.ZodObject<S>>) => ToolResult;
}): Tool {
	return def as unknown as Tool;
}

const ok = (value: unknown): ToolResult => ({ text: JSON.stringify(value, null, 2) });
const fail = (message: string): ToolResult => ({ text: message, isError: true });

const limitParam = z
	.number()
	.int()
	.min(1)
	.max(MAX_LIMIT)
	.default(DEFAULT_LIMIT)
	.describe(`Maximum number of results (default ${DEFAULT_LIMIT}, at most ${MAX_LIMIT}).`);

const queryParam = (what: string) => z.string().trim().min(1).describe(what);

function page<T>(all: T[], limit: number) {
	return { total: all.length, shown: Math.min(all.length, limit), results: all.slice(0, limit) };
}

// ── standards ──────────────────────────────────────────────────────────────────────────────────────────────────────

const listStandards = defineTool({
	name: "list_standards",
	title: "List standards",
	description:
		"List the development standards of the jotis.me suite, grouped by area, with each rule's ID, title and level (Debe, Debería, Puede). Optionally filter by area id (naming, language, git, process).",
	inputSchema: { area: z.string().trim().min(1).optional().describe("Area id, e.g. `git`.") },
	run: ({ standards }, { area }) => {
		const wanted = area ? fold(area) : undefined;
		const areas = standards.areas.filter((a) => !wanted || a.id === wanted || fold(a.prefix) === wanted);
		if (!areas.length)
			return fail(
				`No standards area "${area}". Areas: ${standards.areas.map((a) => a.id).join(", ")}.`,
			);
		return ok({
			version: standards.version,
			areas: areas.map((a) => ({
				id: a.id,
				title: a.title,
				description: a.description,
				url: a.url,
				rules: a.rules.map((r) => ({ id: r.id, title: r.title, level: r.level, url: r.url })),
			})),
		});
	},
});

const getStandard = defineTool({
	name: "get_standard",
	title: "Get a standard",
	description:
		"Get one standard by its ID (e.g. `GIT-001`, case-insensitive): level, who it applies to, statement, rationale, good and bad examples and how it is verified.",
	inputSchema: { id: queryParam("Rule ID such as `NOM-001`.") },
	run: ({ standards }, { id }) => {
		const wanted = id.toUpperCase();
		for (const area of standards.areas) {
			const rule = area.rules.find((r) => r.id === wanted);
			if (rule) return ok({ area: area.id, ...rule });
		}
		return fail(`No standard "${id}". Use list_standards to see the IDs.`);
	},
});

// ── components ─────────────────────────────────────────────────────────────────────────────────────────────────────

const listComponents = defineTool({
	name: "list_components",
	title: "List components",
	description:
		"List the Regula components grouped as the guide groups them, with a one-line description each. Optionally filter by group id or label (e.g. `acciones`, `Formularios`).",
	inputSchema: { group: z.string().trim().min(1).optional().describe("Group id or label.") },
	run: ({ components }, { group }) => {
		const wanted = group ? fold(group) : undefined;
		const groups = components.groups.filter(
			(g) => !wanted || g.id === wanted || fold(g.label) === wanted,
		);
		if (!groups.length)
			return fail(`No group "${group}". Groups: ${components.groups.map((g) => g.id).join(", ")}.`);
		const byName = new Map(components.components.map((c) => [c.name, c]));
		return ok({
			version: components.version,
			groups: groups.map((g) => ({
				id: g.id,
				label: g.label,
				description: g.description,
				components: g.components.flatMap((name) => {
					const c = byName.get(name);
					return c ? [{ name: c.name, description: c.description, url: c.url }] : [];
				}),
			})),
		});
	},
});

const getComponent = defineTool({
	name: "get_component",
	title: "Get a component",
	description:
		"Get the full card of a Regula component by name (e.g. `Button`, case-insensitive): description, usage guide, props (name, type, required, default, description), the native attributes it forwards (`native`: one entry per HTML element, with that element's own attributes; the global HTML attributes, `aria-*` and events are implied), whether it needs `client:*` in Astro, and the Next.js and Astro snippets.",
	inputSchema: { name: queryParam("Component name such as `Button`.") },
	run: ({ components }, { name }) => {
		const wanted = fold(name);
		const found = components.components.find((c) => fold(c.name) === wanted || c.slug === wanted);
		if (found) return ok(found);
		const near = closest(
			name,
			components.components.map((c) => c.name),
		);
		return fail(
			`No component "${name}". Closest names: ${near.join(", ")}. Use list_components to see all.`,
		);
	},
});

// ── tokens ─────────────────────────────────────────────────────────────────────────────────────────────────────────

const searchTokens = defineTool({
	name: "search_tokens",
	title: "Search design tokens",
	description:
		"Search the design tokens by name or usage (e.g. `text-secondary`, `focus`). Each token has its category, its value (per theme, light and dark, when it changes) and what it is for. Optionally filter by category.",
	inputSchema: {
		query: queryParam("Text to look for in the token name or its usage."),
		category: z.enum(TOKEN_CATEGORIES).optional().describe("Token category."),
		limit: limitParam,
	},
	run: ({ tokens }, { query, category, limit }) => {
		const pool = tokens.tokens.filter((t) => !category || t.category === category);
		const found = rank(
			pool.map((t) => ({ item: t, names: [t.name], text: t.usage ?? "" })),
			query,
		);
		return ok({ query, ...page(found, limit) });
	},
});

// ── icons ──────────────────────────────────────────────────────────────────────────────────────────────────────────

const searchIcons = defineTool({
	name: "search_icons",
	title: "Search icons",
	description:
		"Search the icon galleries (line icons, flags, file types, payment methods, cursors) by name, in PascalCase or kebab-case (`SearchLg`, `search-lg`), or by title (a country in Spanish). Each result says how to import it.",
	inputSchema: {
		query: queryParam("Icon name or title."),
		gallery: z
			.enum(GALLERIES as [string, ...string[]])
			.optional()
			.describe("Gallery: icons, flags, files, payments or cursors."),
		limit: limitParam,
	},
	run: ({ icons }, { query, gallery, limit }) => {
		const pool = icons.entries.filter((e) => !gallery || e.gallery === gallery);
		const found = rank(
			pool.map((e) => ({ item: e, names: [e.name, kebab(e.name)], text: e.title ?? "" })),
			query,
		);
		return ok({ query, ...page(found, limit) });
	},
});

// ── everything ─────────────────────────────────────────────────────────────────────────────────────────────────────

const search = defineTool({
	name: "search",
	title: "Search everything",
	description:
		"Search standards, components, tokens and icons at once. Results are grouped by kind, and each one names the tool that gives its detail.",
	inputSchema: {
		query: queryParam("Text to look for."),
		limit: z
			.number()
			.int()
			.min(1)
			.max(MAX_LIMIT)
			.default(5)
			.describe("Maximum results per kind (default 5)."),
	},
	run: ({ standards, components, tokens, icons }, { query, limit }) => {
		const rules = standards.areas.flatMap((a) => a.rules.map((r) => ({ area: a.id, rule: r })));
		return ok({
			query,
			standards: rank(
				rules.map((r) => ({
					item: r,
					names: [r.rule.id],
					text: `${r.rule.title} ${r.rule.statement} ${r.rule.rationale}`,
				})),
				query,
			)
				.slice(0, limit)
				.map(({ rule }) => ({
					id: rule.id,
					title: rule.title,
					level: rule.level,
					url: rule.url,
					detail: "get_standard",
				})),
			components: rank(
				components.components.map((c) => ({
					item: c,
					names: [c.name, c.slug],
					text: `${c.description} ${c.group?.label ?? ""}`,
				})),
				query,
			)
				.slice(0, limit)
				.map((c) => ({
					name: c.name,
					description: c.description,
					url: c.url,
					detail: "get_component",
				})),
			tokens: rank(
				tokens.tokens.map((t) => ({ item: t, names: [t.name], text: t.usage ?? "" })),
				query,
			)
				.slice(0, limit)
				.map((t) => ({
					name: t.name,
					category: t.category,
					value: t.value,
					detail: "search_tokens",
				})),
			icons: rank(
				icons.entries.map((e) => ({ item: e, names: [e.name, kebab(e.name)], text: e.title ?? "" })),
				query,
			)
				.slice(0, limit)
				.map((e) => ({
					gallery: e.gallery,
					name: e.name,
					import: e.import,
					url: e.url,
					detail: "search_icons",
				})),
		});
	},
});

/** Every tool, in the order `tools/list` returns them. The `/start/mcp/` page lists them from here. */
export const TOOLS: readonly Tool[] = [
	listStandards,
	getStandard,
	listComponents,
	getComponent,
	searchTokens,
	searchIcons,
	search,
];
